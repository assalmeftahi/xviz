import {ValidationError, XVIZValidator} from './validator';

// I am not using symbols here because they don't work with maps an test libraries...
const SessionState = Object.freeze({
  DISCONNECTED: 'DISCONNECTED',
  CONNECTED: 'CONNECTED',

  LOG_SESSION_INITIALIZING: 'LOG_SESSION_INITIALIZING',
  LOG_SESSION_ACTIVE: 'LOG_SESSION_ACTIVE',
  TRANSFORMING_LOG: 'TRANSFORMING_LOG',

  LIVE_SESSION_INITIALIZING: 'LIVE_SESSION_INITIALIZING',
  LIVE_SESSION_ACTIVE: 'LIVE_SESSION_ACTIVE'
});

export const MessageTypes = Object.freeze({
  START: 'START',
  ERROR: 'ERROR',
  METADATA: 'METADATA',
  TRANSFORM_LOG: 'TRANSFORM_LOG',
  STATE_UPDATE: 'STATE_UPDATE',
  TRANSFORM_LOG_DONE: 'TRANSFORM_LOG_DONE'
});

const SchemaNames = Object.freeze({
  START: 'session/start',
  ERROR: 'session/error',
  METADATA: 'session/metadata',
  TRANSFORM_LOG: 'session/transform_log',
  STATE_UPDATE: 'session/state_update',
  TRANSFORM_LOG_DONE: 'session/transform_log_done'
});

// Maps state to message that provoke next state
const TransitionTable = Object.freeze({
  // No message transitions for disconnection
  DISCONNECTED: {},

  CONNECTED: {
    START: msg => {
      if (msg.session_type === 'live') {
        return SessionState.LIVE_SESSION_INITIALIZING;
      }
      return SessionState.LOG_SESSION_INITIALIZING;
    }
  },

  LOG_SESSION_INITIALIZING: {
    ERROR: SessionState.DISCONNECTED,
    METADATA: SessionState.LOG_SESSION_ACTIVE
  },

  LOG_SESSION_ACTIVE: {
    TRANSFORM_LOG: SessionState.TRANSFORMING_LOG
  },

  TRANSFORMING_LOG: {
    STATE_UPDATE: SessionState.TRANSFORMING_LOG,
    ERROR: SessionState.TRANSFORMING_LOG,
    TRANSFORM_LOG_DONE: SessionState.LOG_SESSION_ACTIVE
  },

  LIVE_SESSION_INITIALIZING: {
    ERROR: SessionState.DISCONNECTED,
    METADATA: SessionState.LIVE_SESSION_ACTIVE
  },

  LIVE_SESSION_ACTIVE: {
    STATE_UPDATE: SessionState.LIVE_SESSION_ACTIVE,
    ERROR: SessionState.LIVE_SESSION_ACTIVE
  }
});

// This class encodes the XVIZ protocol session state machine, and checks
// a message flow against it.  It can be used by a client to ensure a
// server is sending the right messages, in the right order, and that are
// contain valid data.
export class XVIZSessionValidator {
  constructor() {
    this.msgValidator = new XVIZValidator();
    this.state = SessionState.CONNECTED;
    this.stats = {
      messages: {},
      validationErrors: {},
      stateErrors: {}
    };
    this.lastMessage = null;
  }

  onStart(msg) {
    this.processMessage(msg, MessageTypes.START);
  }

  onError(msg) {
    this.processMessage(msg, MessageTypes.ERROR);
  }

  onMetadata(msg) {
    this.processMessage(msg, MessageTypes.METADATA);
  }

  onTransformLog(msg) {
    this.processMessage(msg, MessageTypes.TRANSFORM_LOG);
  }

  onStateUpdate(msg) {
    this.processMessage(msg, MessageTypes.STATE_UPDATE);
  }

  onTransformLogDone(msg) {
    this.processMessage(msg, MessageTypes.TRANSFORM_LOG_DONE);
  }

  // Denote the connection has been closed
  close() {
    this.state = SessionState.DISCONNECTED;

    if (this.lastMessage !== MessageTypes.ERROR) {
      this.stats.stateErrors[this.state] = 'Close should only happen on error';
    }
  }

  // Record, validate and update protocol state machine
  processMessage(msg, msgType) {
    this.recordMessage(msg, msgType);

    this.runTransition(msg, msgType);
  }

  // Count and validate the message we have received
  recordMessage(msg, msgType) {
    this.lastMessage = msgType;
    this.stats.messages[msgType] = this.stats.messages[msgType] + 1 || 1;

    const schemaName = SchemaNames[msgType];

    if (schemaName === undefined) {
      throw Error(`"${msgType}" does not have a schema name`);
    }

    try {
      this.msgValidator.validate(schemaName, msg);
    } catch (e) {
      if (e instanceof ValidationError) {
        this.stats.validationErrors[msgType] = this.stats.validationErrors[msgType] || 1;
      } else {
        throw e;
      }
    }
  }

  // Update our state machine to the next state
  runTransition(msg, msgType) {
    const validTransitions = TransitionTable[this.state];

    if (validTransitions === undefined) {
      throw Error(`State: ${this.state} does not have any transitions`);
    }

    let nextState = validTransitions[msgType];
    if (typeof nextState === 'function') {
      nextState = validTransitions[msgType](msg);
    }

    if (nextState === undefined) {
      this.stats.stateErrors[this.state] = `While in ${
        this.state
      } state, cannot accept message ${msgType}`;
    } else {
      this.state = nextState;
    }
  }
}
