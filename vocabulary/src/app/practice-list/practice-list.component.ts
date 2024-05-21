import { Component, OnInit, inject } from '@angular/core';
import { PracticeService } from '../services/practice.service';
import { ExtendedPracticeDTO, PracticeDTO, TopicDTO, UserDTO, formatTimestamp } from '../../../models';
import { CommonModule } from '@angular/common';
import { TopicService } from '../services/topic.service';
import { ObjectId } from 'mongodb';
import { RevisionService } from '../services/revision.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-practice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './practice-list.component.html',
  styleUrl: './practice-list.component.css'
})
export class PracticeListComponent implements OnInit {
  private practiceService = inject(PracticeService);
  private topicService = inject(TopicService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  practices: ExtendedPracticeDTO[] = [];
  private tempPractices: ExtendedPracticeDTO[] = [];
  mostPractisedTopic !: TopicDTO | undefined;
  leastRecentlyPractisedTopic !: TopicDTO | undefined;
  cumulatedScore = 0;
  avgScore = 0;
  scoreMaximum = inject(RevisionService).getExerciceNum();
  user!:UserDTO;

  ngOnInit(){
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        this.user = user;
        this.loadPractices(user.username);
      },
      error: (err) => {
        this.toastr.error('Failed to identify current user.', 'Cannot load');
      }
    })
  }

  loadPractices(username: string){
    this.practiceService.getUserFiltered(username).subscribe({
      next: (practices) => {
        try {
          practices.forEach((practice)=>this.createExtendedPractice(practice));
          this.waitForAllExtendedPractices(practices.length);
          this.cumulatedScore = practices.reduce((total, practice) => total + practice.score, 0);
          this.avgScore = Math.round(this.cumulatedScore / (practices.length == 0 ? 1 : practices.length)*100)/100;
        } catch(ex) {
          this.toastr.error('Failed to load practices due to a server error.', 'Cannot load');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load practices due to a server error.', 'Cannot load');
      }
    });
  }

  createExtendedPractice(practice: PracticeDTO) {
    this.topicService.getOne(practice.topicId).subscribe({
      next: (topic) => {
        this.tempPractices.push({
          _id: practice._id,
          topic: topic,
          score: practice.score,
          timestamp: practice.timestamp,
          username: practice.username
        });
      },
      error: (err) => {
        this.toastr.error('Failed to load topic details due to a server error.', 'Cannot load');
        throw err;
      }
    });
  }

  waitForAllExtendedPractices(practiceNum: number) {
    const interval = setInterval(() => {
      if (this.tempPractices.length == practiceNum) {
        clearInterval(interval);
        this.practices = this.tempPractices;
        this.practices.sort((a, b) => -1*a.timestamp.localeCompare(b.timestamp));
        this.mostPractisedTopic = this.getMostPractisedTopic();
        this.leastRecentlyPractisedTopic = this.getLeastRecentlyPractisedTopic();
      }
    }, 100);
  }

  getPractisedTopicNumber(){
    const topicIds = this.practices.map(practice => practice.topic._id);
    const uniqueTopicIds = new Set(topicIds);
    return uniqueTopicIds.size;
  }

  getLeastRecentlyPractisedTopic(){
    const lastPracticeMap = new Map<ObjectId, { topic: TopicDTO | undefined; last_practice: string }>();
    this.practices.forEach(practice => {
      const topic = practice.topic;
      if (!lastPracticeMap.has(topic._id)) {
        lastPracticeMap.set(topic._id, { topic: topic, last_practice: practice.timestamp });
      }
    });
    const leastRecentTopic = [...lastPracticeMap.values()].reduce((min, current) =>
      {return new Date(current.last_practice) < new Date(min.last_practice) ? current : min},
      { topic: undefined, last_practice: new Date().toISOString() }
    );

    return leastRecentTopic.topic ? leastRecentTopic.topic: undefined;
  }

  getMostPractisedTopic() : TopicDTO | undefined {
    const topicCount = new Map<ObjectId, { topic: TopicDTO; count: number }>();
    this.practices.forEach(practice => {
      const topic = practice.topic;
      if (topicCount.has(topic._id)) {
        topicCount.get(topic._id)!.count++;
      } else {
        topicCount.set(topic._id, { topic: topic, count: 1 });
      }
    });

    var mostPracticedTopic: any = { topic: undefined, count: 0 };
    topicCount.forEach(topic => {
      if (topic.count > mostPracticedTopic.count) {
        mostPracticedTopic = topic;
      }
    });

    return mostPracticedTopic.topic;
  }

  getAvgPercent(){
    return Math.round(this.avgScore*100/this.scoreMaximum);
  }

  formatTimestamp(timestamp: string){
    return formatTimestamp(timestamp);
  }
}
