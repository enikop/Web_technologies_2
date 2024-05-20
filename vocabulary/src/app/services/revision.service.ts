import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RevisionService {
  EXERCICE_NUM = 20;

  getExerciceNum(){
    return this.EXERCICE_NUM;
  }
}
