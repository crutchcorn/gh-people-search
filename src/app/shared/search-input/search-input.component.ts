import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, timer} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  searchControl = new FormControl();
  @Output() searchEmit = new EventEmitter<string>();
  submitSubj = new Subject();

  constructor() {
  }

  ngOnInit() {
    // Cancel auto submit if the user has hit enter or clicked button/etc
    this.submitSubj.pipe(
      tap(() => {
        this.searchEmit.emit(this.searchControl.value);
      }),
      switchMap(() =>
      // Submit after user has stopped typing in input for 1.5 seconds
      this.searchControl.valueChanges
        .pipe(
          switchMap(() =>
            // Once timer is up, fire the submitSubject which will reset the value listener and fire the event
            timer(1500).pipe(tap(() => this.submitSubj.next()))
          )
        )
    )).subscribe(() => {});
  }
}
