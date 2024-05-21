import { Component, Input, OnChanges, inject } from '@angular/core';
import { Colour, Level, TopicDTO } from '../../../models';
import { TopicService } from '../services/topic.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.css'
})
export class TopicFormComponent implements OnChanges {
  @Input()
  topic?: TopicDTO;

  colourOptions = Object.values(Colour);
  levelOptions = Object.values(Level);

  private topicService = inject(TopicService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  topicForm = this.formBuilder.group({
    name: this.formBuilder.control(this.topic ? this.topic.name : '', [Validators.required]),
    language: this.formBuilder.control(this.topic ? this.topic.language : '', [Validators.required]),
    colour: this.formBuilder.control(this.topic ? this.topic.colour : Colour.Blue, [Validators.required]),
    level: this.formBuilder.control(this.topic ? this.topic.level : Level.Other, [Validators.required]),
  });

  errorMessage = 'Required field.'

  ngOnChanges(){
    this.topicForm = this.formBuilder.group({
      name: this.formBuilder.control(this.topic ? this.topic.name : '', [Validators.required]),
      language: this.formBuilder.control(this.topic ? this.topic.language : '', [Validators.required]),
      colour: this.formBuilder.control(this.topic ? this.topic.colour : Colour.Blue, [Validators.required]),
      level: this.formBuilder.control(this.topic ? this.topic.level : Level.Other, [Validators.required]),
    });
  }

  saveTopic() {
    if (this.topicForm.valid) {
      const topicData = this.topicForm.value as TopicDTO;
      if (this.topic) {
        this.updateTopic(topicData);
      } else {
        this.createTopic(topicData);
      }
    } else {
      this.toastr.error('Invalid data.', 'Cannot save');
    }
  }

  updateTopic(topicData: TopicDTO) {
    this.topic!.name = topicData.name;
    this.topic!.language = topicData.language;
    this.topic!.colour = topicData.colour;
    this.topic!.level = topicData.level;
    this.topicService.update(this.topic!).subscribe({
      next: () => {
        this.toastr.success(`Topic "${topicData.name}" (${topicData.language}) successfully modified.`, 'Topic updated');
        this.router.navigateByUrl('/topics');
      },
      error: (err) => {
        this.toastr.error('Server error.', 'Cannot save');
      }
    });
  }

  createTopic(topic: TopicDTO) {
    this.topicService.create(topic).subscribe({
      next: () => {
        this.toastr.success(`Topic "${topic.name}" (${topic.language}) successfully added.`, 'Topic created');
        this.router.navigateByUrl('/topics');
      },
      error: (err) => {
        this.toastr.error('Server error.', 'Cannot save');
      }
    });
  }
}
