import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export interface Question {
  question: string;
  resultType: string;
  choices?: string[];
  tableData?: { [key: string]: string }[];
}

export interface ExamContent {
  name: string;
  language: string;
  content: Question[];
}

const s3Client = new S3Client({ region: "ap-southeast-2" });

async function getExamDataFromS3(examId: string): Promise<ExamContent> {
  try {
    const response = await s3Client.send(
      new GetObjectCommand(
        {
          Bucket: "csexam",
          Key: `exams/${examId}.json`
        }
      )
    );
    const stringData = await response.Body?.transformToString();
    if (!stringData) throw new Error("Empty response from S3");
    
    return JSON.parse(stringData) as ExamContent;
  } catch (error) {
    console.error(`Error fetching exam ${examId} from S3:`, error);
    return { name: "", language: "", content: [] };
  }
}

export async function getExamQuestions(examId: string): Promise<ExamContent> {
  try {
    const examData = await getExamDataFromS3(examId);
    return {
      ...examData,
      content: examData.content.filter(
        (q: Question) => ["MULTICHOICE_MANY", "MULTICHOICE_SINGLE"].includes(q.resultType)
      ),
    };
  } catch (error) {
    console.error(`Error loading questions for exam ${examId}:`, error);
    return { name: "", language: "", content: [] };
  }
}

export async function getExamProblemQuestions(examId: string): Promise<ExamContent> {
  try {
    const examData = await getExamDataFromS3(examId);
    return {
      ...examData,
      content: examData.content.filter(
        (q: Question) => ["SQL", "FUNCTION", "EXPRESSION"].includes(q.resultType)
      ),
    };
  } catch (error) {
    console.error(`Error loading problem questions for exam ${examId}:`, error);
    return { name: "", language: "", content: [] };
  }
}

// Load from local
// import { readFile } from 'fs/promises';
// import { join } from 'path';

// export interface Question {
//   question: string;
//   resultType: string;
//   choices?: string[];
// }

// export interface ExamContent {
//   name: string;
//   language: string;
//   content: Question[];
// }

// async function getExamDataFromFile(examId: string): Promise<ExamContent> {
//   try {
//     const filePath = join(process.cwd(), 'src', 'docs', `${examId}.json`);
//     const fileContent = await readFile(filePath, 'utf-8');
//     return JSON.parse(fileContent) as ExamContent;
//   } catch (error) {
//     console.error(`Error reading exam ${examId} from file:`, error);
//     return { name: "", language: "", content: [] };
//   }
// }

// export async function getExamQuestions(examId: string): Promise<ExamContent> {
//   try {
//     const examData = await getExamDataFromFile(examId);
//     return {
//       ...examData,
//       content: examData.content.filter(
//         (q: Question) => ["MULTICHOICE_MANY", "MULTICHOICE_SINGLE"].includes(q.resultType)
//       ),
//     };
//   } catch (error) {
//     console.error(`Error loading questions for exam ${examId}:`, error);
//     return { name: "", language: "", content: [] };
//   }
// }

// export async function getExamProblemQuestions(examId: string): Promise<ExamContent> {
//   try {
//     const examData = await getExamDataFromFile(examId);
//     return {
//       ...examData,
//       content: examData.content.filter(
//         (q: Question) => ["SQL", "FUNCTION", "EXPRESSION"].includes(q.resultType)
//       ),
//     };
//   } catch (error) {
//     console.error(`Error loading problem questions for exam ${examId}:`, error);
//     return { name: "", language: "", content: [] };
//   }
// }

