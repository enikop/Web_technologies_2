import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicStatsComponent } from './topic-stats.component';

describe('TopicStatsComponent', () => {
  let component: TopicStatsComponent;
  let fixture: ComponentFixture<TopicStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
