import { TestBed } from "@angular/core/testing";

import { ThreeLetterPatternService } from "./three-letter-pattern.service";

describe("ThreeLetterPatternService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ThreeLetterPatternService = TestBed.get(ThreeLetterPatternService);
    expect(service).toBeTruthy();
  });
});
