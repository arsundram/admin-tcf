import { TestBed, inject } from '@angular/core/testing';

import { EventEditService } from './event-edit.service';

describe('EventEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventEditService]
    });
  });

  it('should be created', inject([EventEditService], (service: EventEditService) => {
    expect(service).toBeTruthy();
  }));
});
