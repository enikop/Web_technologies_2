
import {Column } from "typeorm"

export class Word {

    @Column()
    source: string

    @Column()
    target: string

    constructor(source: string, target: string) {
      this.source = source;
      this.target = target;
    }

}
