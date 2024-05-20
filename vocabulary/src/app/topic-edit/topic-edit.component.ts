import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TopicDTO } from '../../../models';
import { TopicService } from '../services/topic.service';
import { TopicFormComponent } from '../topic-form/topic-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-edit',
  standalone: true,
  imports: [TopicFormComponent, CommonModule],
  templateUrl: './topic-edit.component.html',
  styleUrl: './topic-edit.component.css'
})
export class TopicEditComponent implements OnInit {
  topic!:TopicDTO;
  private currentRoute = inject(ActivatedRoute);
  private topicService = inject(TopicService);


  ngOnInit(): void {
    this.loadTopic();
  }

  loadTopic(){
    const topicId = this.currentRoute.snapshot.params['id'];
    this.topicService.getOne(topicId).subscribe({
      next: (topic) => {
        this.topic = topic;
      },
      error: (err) => {
        console.log(err + 'hiba');
      }
    });
  }
}
