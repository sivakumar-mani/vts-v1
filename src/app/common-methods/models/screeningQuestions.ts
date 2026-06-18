export class ScreeningQuestions {
    clientId: number;
    clientName: string;
    questionId: number;
    compId: number;
    question: QuestionList[];
    quesOrder: number;
    active: boolean;
    createdUserId: number;
    componetName: string;
    compShortName: string;
    logginId: number;
}
export class QuestionList {
    questionId: number;
    question: string;
}
