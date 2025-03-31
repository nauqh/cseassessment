import { getExamQuestions, getExamProblemQuestions } from '../src/lib/questions';

// Test all functions in questions.ts
async function runTests() {
  // Define test exam ID
  const examId = "M31";
  console.log(`Running tests using exam ID: ${examId}`);
  
  try {
    // Test 1: getExamQuestions
    console.log("\n=== Testing getExamQuestions ===");
    const questionsResult = await getExamQuestions(examId);
    console.log(`Exam name: ${questionsResult.name}`);
    console.log(`Language: ${questionsResult.language}`);
    console.log(`Total questions: ${questionsResult.content.length}`);
    console.log(`Question types: ${questionsResult.content.map(q => q.resultType).join(', ')}`);
    
    // Test 2: getExamProblemQuestions
    console.log("\n=== Testing getExamProblemQuestions ===");
    const problemsResult = await getExamProblemQuestions(examId);
    console.log(`Exam name: ${problemsResult.name}`);
    console.log(`Language: ${problemsResult.language}`);
    console.log(`Total problems: ${problemsResult.content.length}`);
    console.log(`Problem types: ${problemsResult.content.map(q => q.resultType).join(', ')}`);
    
    console.log("\n=== All tests completed successfully ===");
  } catch (error) {
    console.error('Tests failed with error:', error);
  }
}

// Run all tests
runTests();
