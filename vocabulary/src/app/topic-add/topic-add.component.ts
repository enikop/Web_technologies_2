import { Component, SimpleChanges, inject } from '@angular/core';
import { TopicFormComponent } from '../topic-form/topic-form.component';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { TopicDTO } from '../../../models';

@Component({
  selector: 'app-topic-add',
  standalone: true,
  imports: [TopicFormComponent],
  templateUrl: './topic-add.component.html',
  styleUrl: './topic-add.component.css'
})
export class TopicAddComponent {
}
