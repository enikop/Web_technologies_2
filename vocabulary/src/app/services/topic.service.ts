import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TopicDTO } from "../../../models";
import { ObjectId } from 'typeorm';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  http = inject(HttpClient);

  getAll() {
     return this.http.get<TopicDTO[]>('api/topic');
  }

  getOne(id: string) {
    return this.http.get<TopicDTO>('api/topic/' + id);
  }

  create(topic: TopicDTO) {
    return this.http.post<TopicDTO>('api/topic', topic);
  }

  update(topic: TopicDTO) {
    return this.http.put<TopicDTO>('api/topic', topic);
  }

  delete(id: string) {
    return this.http.delete('api/topic/' + id);
  }
}

