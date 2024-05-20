import { Injectable, inject } from '@angular/core';
import { PracticeDTO } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { ObjectId } from 'mongodb';

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  http = inject(HttpClient);

  getAll() {
     return this.http.get<PracticeDTO[]>('api/practice');
  }

  getFiltered(username:string, topicId: string) {
    return this.http.get<PracticeDTO[]>('api/practice/byuserandtopic/' + username +'/'+ topicId);
  }

  getUserFiltered(username:string) {
    return this.http.get<PracticeDTO[]>('api/practice/byuser/' + username);
  }

  create(practice: PracticeDTO) {
    return this.http.post<PracticeDTO>('api/practice', practice);
  }
}
