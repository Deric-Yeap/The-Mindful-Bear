
-- Table: User
create table
  "User" (
    UserID bigint primary key generated always as identity,
    username text not null,
    password text not null,
    dateOfBirth DATE,
    Gender text,
    Department text
  );

-- Table: Journal
create table
  Journal (
    JournalID bigint primary key generated always as identity,
    emotion text,
    audio_file_path text,
    Date DATE
  );

-- Table: user_journal (junction table for User and Journal)
create table
  user_journal (
    UserID bigint not null,
    JournalID bigint not null,
    primary key (UserID, JournalID),
    foreign key (UserID) references "User" (UserID),
    foreign key (JournalID) references Journal (JournalID)
  );

-- Table: Planner
create table
  Planner (
    PlannerID bigint primary key generated always as identity,
    PlannedWalk text
  );

-- Table: planner_user (junction table for Planner and User)
create table
  planner_user (
    UserID bigint not null,
    PlannerID bigint not null,
    primary key (UserID, PlannerID),
    foreign key (UserID) references "User" (UserID),
    foreign key (PlannerID) references Planner (PlannerID)
  );

-- Table: Session
create table
  session (
    SessionID bigint primary key generated always as identity,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    PSS_Before int,
    PSS_After int,
    SMS_Before int,
    SMS_After int,
    Engagement_Metrics int,
    improvement_score int
  );

-- Table: Exercise
create table
  Exercise (
    ExerciseID bigint primary key generated always as identity,
    AudioURL text,
    Description text,
    Rating int
  );

-- Table: Landmarks
create table
  Landmarks (
    LandmarkID bigint primary key generated always as identity,
    Coordinates text,
    ExerciseID bigint,
    foreign key (ExerciseID) references Exercise (ExerciseID)
  );

-- Table: user_session (junction table for User, Session, and Landmarks)
create table
  user_session (
    UserID bigint not null,
    SessionID bigint not null,
    LandmarkID bigint,
    primary key (UserID, SessionID),
    foreign key (UserID) references "User" (UserID),
    foreign key (SessionID) references session (SessionID),
    foreign key (LandmarkID) references Landmarks (LandmarkID)
  );

-- Table: Question
create table
  Question (
    QuestionID bigint primary key generated always as identity,
    QuestionType text,
    Question text
  );

-- Table: Options
create table
  options (
    OptionID bigint primary key generated always as identity,
    Description text
  );