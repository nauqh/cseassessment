from .utils import Utils
from .resource_manager import ResourceManager
# import yaml
import requests
import pandas as pd


class Autograder:
    def __init__(self, submission):
        self.exam_id = submission.exam_id
        self.exam_name = submission.exam_name
        self.answers = [answer["answer"] for answer in submission.answers]

        # Load solutions and config
        self.solution = ResourceManager._get_s3_data(
            f"solutions/{self.exam_id}.yml")
        # with open(f"solutions/{self.exam_id}.yml") as f:
        #     self.solution = yaml.safe_load(f)

        # Initialize resource manager
        self.resource_manager = ResourceManager(
            self.solution.get('config', {}))

        self.summary = {
            "Not submitted": [],
            "Incorrect": [],
            "Partial": [],
            "Correct": [],
            "Issue": [],
        }

    def grade_submission(self):
        q_type_handlers = {
            "MULTICHOICE": lambda answer, i: (
                Utils.check_multichoice(answer, self.solution[i]["answer"], i),
                None,
            ),
            "FUNCTION": lambda answer, i: Utils.check_function(
                answer,
                self.solution[i]["answer"],
                i,
                globals(),
                self.resource_manager.get_resource('test_cases')[str(i)],
            ),
            "SQL": lambda answer, i: Utils.check_sql(
                answer,
                self.solution[i]["answer"],
                i,
                self.resource_manager.get_resource('database')
            ),
            "EXPRESSION": lambda answer, i:
                Utils.check_expression(
                    answer,
                    self.solution[i]["answer"],
                    i,
                    {**globals(), "df": self.resource_manager.get_resource('dataframe'), "pd": pd},
            ),
        }

        for i, answer in enumerate(self.answers, 1):
            issue = None
            correct = None
            if answer:
                q_type = self.solution[i]["type"]
                correct, issue = q_type_handlers[q_type](answer, i)

            self.summary[
                {
                    None: "Not submitted",
                    True: "Correct",
                    False: "Incorrect",
                    "Partial": "Partial",
                }[correct]
            ].append(i)

            if issue:
                self.summary["Issue"].append((i, issue))

    def calculate_score(self, q_index: int) -> int:
        """Return the score for a question based on its type."""
        q_type = self.solution[q_index]["type"]
        return {
            "SQL": 6,
            "EXPRESSION": 6,
            "MULTICHOICE": 4,
            "FUNCTION": 10,
        }.get(q_type, 0)

    def _calculate_final_score(self) -> float:
        final_score = 0
        for key, value in self.summary.items():
            for question in value:
                if key == "Correct":
                    final_score += self.calculate_score(question)
                elif key == "Partial":
                    final_score += self.calculate_score(question) / 2
        return final_score

    def display_summary(self):
        print(f"{self.exam_name} - EXAM SUMMARY")

        for key, value in self.summary.items():
            print(f"{key}: {len(value)}")
            for question in value:
                if key == "Issue":
                    print(f"  - {question[1]}")
                    continue
                score = (
                    f"{self.calculate_score(question)}/{self.calculate_score(question)}"
                    if key == "Correct"
                    else f"{self.calculate_score(question)/2:g}/{self.calculate_score(question)}"
                    if key == "Partial"
                    else f"0/{self.calculate_score(question)}"
                )
                print(f"  - Q{question} ({score})")

        final_score = self._calculate_final_score()
        print(f"FINAL SCORE: {final_score:g}/100")

    def create_report(self):
        result = f"{self.exam_name} - EXAM SUMMARY\n"

        for key, value in self.summary.items():
            result += f"{key}: {len(value)}\n"
            for question in value:
                if key == "Issue":
                    result += f"  - {question[1]}\n"
                    continue
                score = (
                    f"{self.calculate_score(question)}/{self.calculate_score(question)}"
                    if key == "Correct"
                    else f"{self.calculate_score(question)/2:g}/{self.calculate_score(question)}"
                    if key == "Partial"
                    else f"0/{self.calculate_score(question)}"
                )
                result += f"  - Q{question} ({score})\n"

        final_score = self._calculate_final_score()
        result += f"FINAL SCORE: {final_score:g}/100\n"

        return result, final_score


if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.dirname(
        os.path.dirname(os.path.abspath(__file__))))

    from schemas import Submission

    email = "quan.do@gmail.com"
    exam_id = "M11"

    response = requests.get(
        f"https://cseassessment.up.railway.app/submissions/{exam_id}/{email}"
    )

    if response.status_code != 200:
        print("Submission not found.")
    else:
        response = response.json()
        submission = Submission(**response)

        import json
        print(json.dumps(submission.__dict__, indent=2))
        # autograder = Autograder(submission)
        # autograder.grade_submission()
        # autograder.display_summary()
