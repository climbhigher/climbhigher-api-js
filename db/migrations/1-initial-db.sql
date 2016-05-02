
CREATE TYPE climb_finish AS ENUM (
    'attempt', 'redpoint', 'onsight', 'flash'
);

CREATE TYPE climb_style AS ENUM (
    'bouldering', 'toprope', 'lead'
);

CREATE TYPE climb_grade AS ENUM (
    'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
    'V11', 'V12', 'V13', 'V14', 'V15',
    
    '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', 
    '5.10', '5.10a', '5.10b', '5.10c', '5.10d',
    '5.11', '5.11a', '5.11b', '5.11c', '5.11d', 
    '5.12', '5.12a', '5.12b', '5.12c', '5.12d',
    '5.13', '5.13a', '5.13b', '5.13c', '5.13d', 
    '5.14', '5.14a', '5.14b', '5.14c', '5.14d',
    '5.15', '5.15a', '5.15b'
);


CREATE TABLE users (
    id              uuid            PRIMARY KEY,
    name            varchar(255)    NOT NULL,
    email           varchar(255)    NOT NULL UNIQUE,
    location        varchar(255)    NOT NULL DEFAULT '',
    password_salt   varchar(255)    NOT NULL,
    password_hash   varchar(255)    NOT NULL,

    created_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    updated_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    deleted_at      timestamptz
);

CREATE UNIQUE INDEX idx_users_email ON users (email);

CREATE TABLE sessions (
    id              uuid            PRIMARY KEY,
    user_id         uuid            NOT NULL REFERENCES users,
    location        varchar(128)    NOT NULL DEFAULT '',
    date            timestamptz     NOT NULL DEFAULT current_timestamp,

    created_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    updated_at      timestamptz     NOT NULL DEFAULT current_timestamp,
    deleted_at      timestamptz
);

CREATE INDEX idx_sessions_user ON sessions (user_id);

CREATE TABLE ascents (
    id                  uuid            PRIMARY KEY,
    session_id          uuid            NOT NULL REFERENCES sessions,
    climb_style         climb_style     NOT NULL,
    climb_grade         climb_grade     NOT NULL,
    climb_finish        climb_finish    NOT NULL,

    created_at          timestamptz     NOT NULL DEFAULT current_timestamp,
    updated_at          timestamptz     NOT NULL DEFAULT current_timestamp,
    deleted_at          timestamptz
);

CREATE INDEX idx_ascents_session_id ON ascents (session_id);
