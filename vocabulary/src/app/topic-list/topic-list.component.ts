import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { ExtendedTopicDTO, PracticeDTO, TopicDTO, formatTimestamp } from '../../../models';
import { CommonModule } from '@angular/common';
import { PracticeService } from '../services/practice.service';
import { UserService } from '../services/user.service';
import { RouterLink } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RevisionService } from '../services/revision.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbTooltipModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
export class TopicListComponent implements OnInit {

  private topicService = inject(TopicService);
  private practiceService = inject(PracticeService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private modalService = inject(NgbModal);

  topics: ExtendedTopicDTO[] = [];
  toBeDeleted: ExtendedTopicDTO | undefined;
  private tempTopics: ExtendedTopicDTO[] = [];

  username = '';
  exerciseNumber = inject(RevisionService).getExerciceNum();

  ngOnInit(): void {
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        this.username = user.username;
        this.loadTopics();
      },
      error: (err) => {
        this.toastr.error('Failed to identify current user.', 'Cannot load');
      }
    });
  }

  loadTopics(){
    this.tempTopics = [];
    this.topicService.getAll().subscribe({
      next: (topics) => {
        try{
          for(let topic of topics){
            this.createExtendedTopic(topic);
          }
          this.waitForAllExtendedTopics(topics.length);
        } catch (err) {
          this.toastr.error('Failed to load topic details due to a server error.', 'Cannot load');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load topic details due to a server error.', 'Cannot load');
      }
    });
  }

  createExtendedTopic(topic: TopicDTO) {
    this.practiceService.getFiltered(this.username, topic._id.toString()).subscribe({
      next: (practices) => {
        const output = {...topic, ...{last_revised: this.getMostRecentDate(practices), revision_count: practices.length}}
        this.tempTopics.push(output);
      },
      error: (err) => {
        this.toastr.error('Failed to load practice details due to a server error.', 'Cannot load');
        throw err;
      }
    });
  }

  waitForAllExtendedTopics(topicNum: number) {
    const interval = setInterval(() => {
      if (this.tempTopics.length == topicNum) {
        clearInterval(interval);
        this.topics = this.tempTopics;
        this.topics.sort((a, b) =>a.language.localeCompare(b.language) || a._id.toString().localeCompare(b._id.toString()));
      }
    }, 100);
  }

  getMostRecentDate(practices: PracticeDTO[]): string {
    if (practices.length === 0) return 'never';
    const dates = practices.map(practice => new Date(practice.timestamp).toISOString());
    const mostRecentDate = dates.reduce((latest, current) => {
      return current > latest ? current : latest;
    });
    return mostRecentDate;
  }

  formatTimestamp(timestamp: string){
    if(timestamp == 'never') return timestamp;
    return formatTimestamp(timestamp);
  }

  deleteTopic(topic: TopicDTO){
    this.topicService.delete(topic._id.toString()).subscribe({
      next: () => {
        this.toastr.success(`Topic "${topic.name}" (${topic.language}) successfully deleted.`, 'Topic deleted');
        this.loadTopics();
      },
      error: (err) => {
        this.toastr.error('Failed to delete topic due to a server error.', 'Cannot delete');
      }
    })
  }

  toggleDeleteTopicModal(topic: ExtendedTopicDTO, content: TemplateRef<any>) {
    this.toBeDeleted = topic;
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.deleteTopic(topic);
			},
			(reason) => {
				this.toastr.info('The selected topic will not be deleted.', 'Operation dismissed');
			},
		);
	}

}

