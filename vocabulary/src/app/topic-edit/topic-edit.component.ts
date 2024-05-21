import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicDTO } from '../../../models';
import { TopicService } from '../services/topic.service';
import { TopicFormComponent } from '../topic-form/topic-form.component';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  private router = inject(Router);


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
        this.toastr.error('Failed to load topic details due to a server error.', 'Cannot load');
        this.router.navigateByUrl('/');
      }
    });
  }
}
