import { Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { PracticeService } from '../services/practice.service';
import { PracticeDTO, TopicDTO, convertColourToHex, formatTimestamp } from '../../../models';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { CommonModule } from '@angular/common';
import { RevisionService } from '../services/revision.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { UserService } from '../services/user.service';

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
        //TODO
        console.log(err + 'hiba');
      }
    });
    this.userService.getAuthenticated().subscribe({
      next: (user) => {
        this.loadPractices(user.username);
      },
      error: (err) => {
        //TODO
      }
    });
  }

  loadPractices(username: string){
    const topicId = this.currentRoute.snapshot.params['id'];
    this.practiceService.getFiltered(username, topicId).subscribe({
      next: (practices) => {
        practices.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
        this.practices = practices;
      },
      error: (err) => {
        console.log(err + 'hiba');
      }
    });
  }

  ngAfterViewInit(){
    const interval = setInterval(()=>{
      if(this.practices){
        clearInterval(interval);
        if(this.practices.length > 0){
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
          label: 'Your scores out of '+this.scoreMaximum,
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
              color: 'white' // Set x-axis text color to white
            }
          },
          y: {
            beginAtZero: true,
            max: 20,
            title: {
              display: true,
              text: 'Score',
              color: 'white'
            },
            ticks: {
              color: 'white' // Set y-axis text color to white
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' // Set legend text color to white
            }
          },
          tooltip: {
            titleColor: 'white', // Set tooltip title color to white
            bodyColor: 'white', // Set tooltip body color to white
            footerColor: 'white' // Set tooltip footer color to white
          },
          zoom: {
            limits: {
              x: { min: Date.parse('2024-01-01T00:00:00Z'), max: Date.parse((data[data.length-1].x.getFullYear()+1)+'-01-01T00:00:00Z') }
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

  createFrequencyDistribution(): number[]{
    const scoreDistribution = new Array(21).fill(0);
    this.practices.forEach(practice => {
      scoreDistribution[practice.score]++;
    });
    return scoreDistribution;
  }

  drawDistributionChart() {
    const ctx = this.distChart.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const frequencyDistribution = this.createFrequencyDistribution();
    const labels = Array.from({ length: 21 }, (_, i) => i.toString());
    // Ensure ctx is not null
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    // Number array chart data
    this.distributionChart = new Chart(ctx, {
      type: 'bar', // Specify the type of chart you want to create
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
              color: 'white' // Set x-axis text color to white
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
              color: 'white' // Set y-axis text color to white
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' // Set legend text color to white
            }
          },
          tooltip: {
            titleColor: 'white', // Set tooltip title color to white
            bodyColor: 'white', // Set tooltip body color to white
            footerColor: 'white' // Set tooltip footer color to white
          }
        }
      }
    });
  }

  formatTimestamp(timestamp: string) {
    return formatTimestamp(timestamp);
  }

}
