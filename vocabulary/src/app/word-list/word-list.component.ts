import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { PracticeDTO, TopicDTO, WordDTO } from '../../../models';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { PracticeService } from '../services/practice.service';
import { WordFormComponent } from '../word-form/word-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-word-list',
  standalone: true,
  imports: [CommonModule, WordFormComponent],
  templateUrl: './word-list.component.html',
  styleUrl: './word-list.component.css'
})
export class WordListComponent implements OnInit, OnChanges{

  private currentRoute = inject(ActivatedRoute);
  private topicService = inject(TopicService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  words: WordDTO[] = [];
  topic!: TopicDTO;
  changeCount = 0;

  ngOnInit(): void {
    this.loadTopic();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadTopic();
  }

  loadTopic(){
    const topicId = this.currentRoute.snapshot.params['id'];
    this.topicService.getOne(topicId).subscribe({
      next: (topic) => {
        this.topic = topic;
        this.words = topic.words;
      },
      error: (err) => {
        this.toastr.error('Failed to load topic details due to a server error.', 'Cannot load');
        this.router.navigateByUrl('/');
      }
    });
  }

  increaseChangeCount(){
    this.changeCount++;
  }

  deleteWord(word: WordDTO) {
    const index = this.topic.words.indexOf(word);
    this.topic.words.splice(index, 1);
    this.topicService.update(this.topic).subscribe({
      next: () => {
        this.toastr.success(`Word successfully deleted: ${word.target} - ${word.source}.`, 'Word deleted');
        this.loadTopic();
      },
      error: (err) => {
        this.toastr.error('Failed to delete word due to a server error.', 'Cannot delete');
      }
    })
  }
}
