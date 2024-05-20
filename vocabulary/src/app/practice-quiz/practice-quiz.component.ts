import { Component, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { PracticeService } from '../services/practice.service';
import { ExtendedWordDTO, PracticeDTO, TopicDTO, WordDTO } from '../../../models';
import { RevisionService } from '../services/revision.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-practice-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbTooltipModule],
  templateUrl: './practice-quiz.component.html',
  styleUrl: './practice-quiz.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PracticeQuizComponent {
  private router = inject(Router);
  private topicService = inject(TopicService);
  private practiceService = inject(PracticeService);
  private userService = inject(UserService);
  private currentRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);

  //TODO
  username = '';

  topic !: TopicDTO;
  words: ExtendedWordDTO[] = [];
  exerciceNumber = inject(RevisionService).getExerciceNum();
  wordForm = this.formBuilder.group({
    words: this.formBuilder.array<FormGroup>([])
  });
  isSolutionShown = false;

  ngOnInit(): void {
    const topicId = this.currentRoute.snapshot.params['id'];
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        this.username = user.username;
      },
      error: (err) => {
        //TODO
      }
    });
    this.topicService.getOne(topicId).subscribe({
      next: (topic) => {
        this.topic = topic;
        this.createExtendedWords(topic.words);
        this.initForm();
      },
      error: (err) => {
        //TODO
        console.log(err + 'hiba');
      }
    });
  }

  createExtendedWords(words: WordDTO[]) {
    if (words.length < this.exerciceNumber) {
      this.router.navigateByUrl('/topics');
      return;
    } else {
      const selectedWords = this.getRandomWords(words, this.exerciceNumber);
      this.words = selectedWords.map(word => this.convertToExtendedWordDTO(word));
    }
  }

  getRandomWords(words: WordDTO[], count: number): WordDTO[] {
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  convertToExtendedWordDTO(word: WordDTO): ExtendedWordDTO {
    return {
      source: word.source,
      target: word.target,
      targetBlank: Math.random() < 0.75,
      answer: '',
      correct: true
    };
  }

  initForm() {
    const wordControls = this.words.map((word) => {
      return this.formBuilder.group({
        target : new FormControl({ value: word.targetBlank ? '' : word.target, disabled: !word.targetBlank }),
        source: new FormControl({ value: word.targetBlank ? word.source : '', disabled: word.targetBlank })
      });
    });

    const wordFormArray = this.formBuilder.array(wordControls);
    this.wordForm.setControl('words', wordFormArray);
  }

  get wordFormArray(): FormArray {
    return this.wordForm.get('words') as FormArray;
  }


  submitSolution() {
    console.log(this.wordForm.value);
    // Access the array inside wordForm
    const wordsArray = this.wordFormArray.value;

    this.words.forEach((word, index) => {
      this.checkWord(wordsArray[index], word);
    });
    const practice = {
      timestamp: (new Date()).toISOString(),
      score: this.calculateScore(),
      username: this.username,
      topicId: this.topic._id.toString()
    }
    this.createPractice(practice as PracticeDTO);
  }

  createPractice(practice: PracticeDTO){
    this.practiceService.create(practice).subscribe({
      next: () => {
        //redirect
        this.isSolutionShown = true;
      },
      error: (err) => {
        //TODO
      }
    });
  }

  navigateToStats(){
    this.router.navigateByUrl('/topics/stats/'+this.topic._id.toString());
  }

  checkWord(toCheck: any, word: ExtendedWordDTO){
    if (word.targetBlank){
      word.answer = toCheck.target.trim();
      word.correct = word.answer == word.target;
    } else {
      word.answer = toCheck.source.trim();
      word.correct = word.answer == word.source;
    }
  }

  calculateScore(){
    return this.words.filter(word => word.correct).length;
  }
}
