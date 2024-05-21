import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TopicDTO, WordDTO } from '../../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-word-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './word-form.component.html',
  styleUrl: './word-form.component.css'
})
export class WordFormComponent {
  @Output()
  wordChangeEvent = new EventEmitter<void>();

  @Input()
  topic !: TopicDTO;

  private topicService = inject(TopicService);
  private formBuilder = inject(FormBuilder);
  private toastr = inject(ToastrService);

  wordForm = this.formBuilder.group({
    source: this.formBuilder.control('', [Validators.required]),
    target: this.formBuilder.control('', [Validators.required]),
  });

  errorMessage = 'Required.'

  saveWord(){
    if (this.wordForm.valid) {
      const word = this.wordForm.value as WordDTO;
      this.addWord(word);
    } else {
      this.toastr.error('Invalid data.', 'Cannot save');
    }
  }

  addWord(word: WordDTO){
    this.topic.words.push(word);
    this.topicService.update(this.topic).subscribe({
      next: () => {
        this.wordChangeEvent.emit();
        this.wordForm.reset();
        this.toastr.success(`Word successfully added: ${word.target} - ${word.source}.`, 'Word saved');
      },
      error: (err) => {
        this.toastr.error('Server error.', 'Cannot save');
      }
    })
  }
}
