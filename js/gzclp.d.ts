export interface Exercise {
  id: string;
  tier: string;
  name: string;
  weight: number;
  sets: number;
  reps: number;
  amrap: boolean;
  repSchemeIndex: number;
  success?: boolean;
}

export interface Session {
  id: number;
  name: string;
  day: number;
  exercises: Exercise[];
}

export interface StartingWeights {
  squat: number;
  bench: number;
  deadlift: number;
  overheadPress: number;
  row: number;
}

export interface ProgramState {
  lifts: Record<string, any>;
  nextLiftID: number;
  sessions: Array<{ name: string; lifts: string[] }>;
  nextSessionID: number;
  completedSessions: Array<Record<string, number>>;
  isFirstTime: boolean;
  setupComplete?: boolean;
}

export const gzclp: {
  state: ProgramState;
  SMALLEST_INCREMENT: number;
  T1_DELOAD_FACTOR: number;
  T2_DELOAD_FACTOR: number;
  REP_SCHEMES: Record<string, string[][]>;
  REST_TIMES: Record<string, number[]>;
  INCREMENTS: number[];
  DEFAULT_LIFTS: any[][];
  
  // Methods
  getIncrements(): number[];
  getNumberOfRepSchemes(tier: string): number;
  getRepScheme(tier: string, repSchemeIndex: number): string[];
  getNumberOfSets(tier: string, repSchemeIndex: number): number;
  getNumberOfRepsInASet(tier: string, repSchemeIndex: number, setIndex: number): string;
  getDisplayedRepsPerSet(tier: string, repSchemeIndex: number): string;
  getRestTime(tier: string): string;
  getProgramState(): ProgramState;
  setProgramState(programState: ProgramState): void;
  getAllLifts(): Record<string, any>;
  addLift(id: string, lift: any): void;
  getNumberOfSessions(): number;
  getSessionName(id: number): string;
  getSessionLifts(id: number): string[];
  setSessionLifts(id: number, arr: string[]): void;
  getCurrentSessionID(): number;
  setCurrentSessionID(num: number): void;
  getNextLiftID(): number;
  setNextLiftID(num: number): void;
  getLiftTier(id: string): string;
  getLiftName(id: string): string;
  getLiftIncrement(id: string): number;
  setLiftTier(id: string, tier: string): void;
  setLiftName(id: string, name: string): void;
  setLiftIncrement(id: string, increment: number): void;
  getNextAttemptWeight(id: string): number;
  getNextAttemptRepSchemeIndex(id: string): number;
  setNextAttemptWeight(id: string, weight: number): void;
  setNextAttemptRepSchemeIndex(id: string, repSchemeIndex: number): void;
  getAllCompletedSessions(): Array<Record<string, number>>;
  getCompletedSession(id: number): Record<string, number>;
  setCompletedSessions(completedSessions: Array<Record<string, number>>): void;
  addCompletedSession(completedSession: Record<string, number>): void;
  isFirstTime(): boolean;
  setIsFirstTime(bool: boolean): void;
  
  // Added methods
  getNextSession(): Session;
  recordSetResult(session: Session, exerciseIndex: number, setIndex: number, success: boolean): boolean;
  completeSession(session: Session): boolean;
  getDefaultWeights(): StartingWeights;
  setStartingWeights(weights: StartingWeights): boolean;
  completeSetup(): boolean;
  
  // Existing methods
  createNewLift(tier: string, name: string, increment: number, weight: number): any;
  addLiftToProgram(tier: string, name: string, increment: number, startingWeight: number, sessions: number | number[]): void;
  removeLiftFromProgram(id: string): void;
  addLiftToSessions(sessionIDs: number | number[], liftID: string): void;
  addLiftToSession(sessionID: number, liftID: string): void;
  removeLiftFromSessions(id: string, sessions: number | number[]): void;
  addToLiftPreviousAttempts(id: string, weight: number, repSchemeIndex: number): void;
  resetProgramState(): void;
  saveProgramState(): Promise<void>;
  fetchProgramState(): Promise<ProgramState | null>;
  deleteSavedProgramState(): Promise<void>;
  outputProgramStateAsString(): string;
  getAllLiftIDsInTier(tier: string): string[];
  sortLiftIDsByTier(liftIDs: string[]): string[];
  incrementSessionCounter(): void;
  handleSuccessfulLift(liftID: string): void;
  handleFailedLift(liftID: string): void;
  roundDownToNearestIncrement(number: number, increment: number): number;
}; 