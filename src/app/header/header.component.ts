import { Component, OnInit, Input, Output } from '@angular/core';
import * as _ from 'lodash';

import { ThreeLetterPatternService } from '../three-letter-pattern.service';
import { IThreeLetterPattern } from '../three-letter-pattern.model';


@Component({
  selector: 'lsn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  public x = 0;
  @Input()
  public title = 'De Lijst 4.1';

  @Output()
  public  fill() {
    let startAdding: boolean;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

     _.each(alphabet, (letter1: string) => {
      _.each(alphabet, (letter2: string) => {
         _.each(alphabet, (letter3: string) => {
          const pattern: IThreeLetterPattern = {
            LetterPattern: `${letter1}${letter2}${letter3}`,
            CreateTimeStamp: new Date(),
            Occurrences: 0,
            Id: undefined
          };
          this.x++;

          if (pattern.LetterPattern === 'znf') {
            startAdding = true;
          }
          if (startAdding) {

             this.threeLetterPattern.add(pattern);
          }
        });
      });
    });

  }

  @Output()
  public testLetterOccurence(): void {
    this.threeLetterPattern.addOccurenceFrom('abc').subscribe();
  }
  constructor(private threeLetterPattern: ThreeLetterPatternService) {
   }

  ngOnInit() {
  }
}
