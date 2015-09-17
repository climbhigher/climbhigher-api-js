CREATE TABLE climb_finishes (
    name            varchar(32)     PRIMARY KEY,
    display_name    varchar(32)     NOT NULL
);

CREATE TABLE climb_styles (
    name            varchar(32)     PRIMARY KEY,
    display_name    varchar(32)     NOT NULL
);

CREATE TABLE climb_grades (
    id                  uuid            PRIMARY KEY,
    value               varchar(32)     NOT NULL,
    climb_style_name    varchar(32)     NOT NULL REFERENCES climb_styles
);

CREATE INDEX idx_climb_grades_climb_style ON climb_grades (climb_style_name);

CREATE TABLE users (
    id              uuid            PRIMARY KEY,
    email           varchar(255)    NOT NULL UNIQUE,
    password_salt   varchar(255)    NOT NULL,
    password_hash   varchar(255)    NOT NULL,
    apikey          uuid,
    created_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    updated_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    deleted_at      timestamp
);

CREATE UNIQUE INDEX idx_users_email ON users (email);

CREATE TABLE sessions (
    id              uuid            PRIMARY KEY,
    user_id         uuid            NOT NULL REFERENCES users,
    location        varchar(128)    NOT NULL DEFAULT '',
    date            timestamptz     NOT NULL DEFAULT current_timestamp,

    created_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    updated_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    deleted_at      timestamp
);

CREATE INDEX idx_sessions_user ON sessions (user_id);

CREATE TABLE ticks (
    id                  uuid            PRIMARY KEY,
    session_id          uuid            NOT NULL REFERENCES sessions,
    climb_style_name    varchar(32)     NOT NULL REFERENCES climb_styles,
    climb_grade_value   varchar(32)     NOT NULL,
    climb_finish_name   varchar(32)     NOT NULL REFERENCES climb_finishes,

    created_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    updated_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    deleted_at      timestamp
);

CREATE INDEX idx_ticks_session_id ON ticks (session_id);
