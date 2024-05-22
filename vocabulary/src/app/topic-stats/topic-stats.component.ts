import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PracticeService } from '../services/practice.service';
import { PracticeDTO, TopicDTO, convertColourToHex, formatTimestamp } from '../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { CommonModule } from '@angular/common';
import { RevisionService } from '../services/revision.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topic-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-stats.component.html',
  styleUrl: './topic-stats.component.css'
})
export class TopicStatsComponent implements OnInit {
  @ViewChild('chart') lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distChart') distChart!: ElementRef<HTMLCanvasElement>;


  private currentRoute = inject(ActivatedRoute);
  private practiceService = inject(PracticeService);
  private topicService = inject(TopicService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  topic!: TopicDTO;
  practices: PracticeDTO[] = [];
  scoreMaximum = inject(RevisionService).getExerciceNum();
  timelineChart !: Chart<any>;
  distributionChart !: Chart<any>;

  ngOnInit(): void {
    Chart.register(...registerables, zoomPlugin);
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
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        this.loadPractices(user.username);
      },
      error: (err) => {
        this.toastr.error('Failed to identify current user.', 'Cannot load');
        this.router.navigateByUrl('/');
      }
    });
  }

  loadPractices(username: string) {
    const topicId = this.currentRoute.snapshot.params['id'];
    this.practiceService.getFiltered(username, topicId).subscribe({
      next: (practices) => {
        practices.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        this.practices = practices;
      },
      error: (err) => {
        this.toastr.error('Failed to load practice details due to a server error.', 'Cannot load');
        this.router.navigateByUrl('/');
      }
    });
  }

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (this.practices) {
        clearInterval(interval);
        if (this.practices.length > 0) {
          this.drawTimeline();
          this.drawDistributionChart();
        }
      }
    }, 100);
  }

  drawTimeline() {
    const ctx = this.lineChart.nativeElement.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    const data = this.practices.map(practice => ({
      x: new Date(practice.timestamp),
      y: practice.score
    }));

    this.timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Your scores out of ' + this.scoreMaximum,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderColor: convertColourToHex(this.topic.colour),
          data: data,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              minUnit: 'minute',
              displayFormats: {
                hour: 'MMM dd H:mm',
                minute: 'MMM dd H:mm',
              }
            },
            title: {
              display: true,
              text: 'Date',
              color: 'white'
            },
            ticks: {
              color: 'white'
            }
          },
          y: {
            beginAtZero: true,
            max: this.scoreMaximum,
            title: {
              display: true,
              text: 'Score',
              color: 'white'
            },
            ticks: {
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            titleColor: 'white',
            bodyColor: 'white',
            footerColor: 'white'
          },
          zoom: {
            limits: {
              x: { min: Date.parse('2024-01-01T00:00:00Z'), max: Date.parse((data[data.length - 1].x.getFullYear() + 1) + '-01-01T00:00:00Z') }
            },
            pan: {
              enabled: true,
              mode: 'x'
            },
            zoom: {
              wheel: {
                enabled: true
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            }
          }
        }
      }
    });
  }

  createFrequencyDistribution(): number[] {
    const scoreDistribution = new Array(this.scoreMaximum + 1).fill(0);
    this.practices.forEach(practice => {
      scoreDistribution[practice.score]++;
    });
    return scoreDistribution;
  }

  drawDistributionChart() {
    const ctx = this.distChart.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const frequencyDistribution = this.createFrequencyDistribution();
    const labels = Array.from({ length: this.scoreMaximum + 1 }, (_, i) => i.toString());
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.distributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Score distribution',
          backgroundColor: convertColourToHex(this.topic.colour),
          borderColor: convertColourToHex(this.topic.colour),
          data: frequencyDistribution,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Score',
              color: 'white'
            },
            type: 'linear',
            position: 'bottom',
            ticks: {
              stepSize: 1,
              color: 'white'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Frequency',
              color: 'white'
            },
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: 'white'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            titleColor: 'white',
            bodyColor: 'white',
            footerColor: 'white'
          }
        }
      }
    });
  }

  formatTimestamp(timestamp: string) {
    return formatTimestamp(timestamp);
  }

}
