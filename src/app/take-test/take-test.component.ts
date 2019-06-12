import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';

import {TakeTestApiService} from '../services/take-test-api.service';
import ITakeTestModel from '../share/ITakeTestModel';

@Component({
  selector: 'app-take-test',
  templateUrl: './take-test.component.html',
  styleUrls: ['./take-test.component.css']
})
export class TakeTestComponent implements OnInit {
  questionBankID: string;
  questionBankName: string;
  testTakerID = "2";
  currentQuestionID: number;
  orderOfQuestionInTest: number;
  questionText: string;
  category: string;
  answer: string;
  options: any;
  testID: number;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private test$: TakeTestApiService
  ) {
    this.questionBankID = route.snapshot.params['questionbankid'];
    console.log(this.questionBankID);
    test$.getFirstQuestion(this.questionBankID)
      .subscribe(
        result => {
          this.questionBankName = result[0].questionBankName;
          this.currentQuestionID = result[0].questionID;
          this.orderOfQuestionInTest = 1;
          this.questionText = result[0].questionText;
          this.category = result[0].category;
          this.options = result[0].options;
          this.answer = result[0].answer;
          test$.getTestID(this.questionBankID, this.testTakerID)
            .subscribe(
              testid => {
                this.testID = testid;
              });
        },
        () => {
        },
        () => {
        },
      );
  }

  // Gets user's choice from available answer options
  // Passes on choice to service
  submitAnswer(form) {
    // (if answer is) correct: 1 == true, 0 == false
    var correct: number;
    var answer = form.value['answer'];
    if (answer === this.answer){
      correct = 1;
    } else{
      correct = 0;
    }
    var testData = {
      testID : this.testID,
      testTakerID : this.testTakerID,
      questionBankID : this.questionBankID,
      questionID : this.currentQuestionID,
      orderOfQuestionInTest : this.orderOfQuestionInTest,
      category : this.category,
      isCorrect : correct
    };
    this.test$.submitAnswer(testData, this.questionBankID)
    .subscribe(
      result => {},
      () => {
        this.test$.getNextQuestion(this.questionBankID, this.testTakerID, this.testID)
        .subscribe(
          result => {
            this.questionBankName = result.questionBankName;
            this.currentQuestionID = result.questionID;
            this.orderOfQuestionInTest = this.orderOfQuestionInTest + 1;
            this.questionText = result.questionText;
            this.category = result.category;
            this.options = result.options;
            this.answer = result.answer;
          }
        );
      }
    );
  }

  ngOnInit() {
  }

}
