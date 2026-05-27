// ============================================================
//  TRIBAL TRAINING — Strava Dashboard Pipeline
//  Google Apps Script  |  paste into Extensions > Apps Script
// ============================================================
//
//  SETUP CHECKLIST
//  ---------------
//  1. Replace CLIENT_ID and CLIENT_SECRET below with your
//     values from strava.com/settings/api
//  2. Paste each athlete's refresh token into the ATHLETES
//     array (see Phase 2 instructions for how to collect these)
//  3. Run setupSheets() once manually to create all tabs
//  4. Run fullSync() once manually to verify everything works
//  5. Run installTrigger() once — fullSync runs nightly at 2am ET
//
// ============================================================


// ── CONFIGURATION ───────────────────────────────────────────

var CONFIG = {
  CLIENT_ID:     'YOUR_CLIENT_ID_HERE',       // from strava.com/settings/api
  CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE',   // from strava.com/settings/api
  SHEET_NAME:    'Tribal Training Data',
  WEEKS_BACK:    0,   // 0 = current week-to-date (correct for nightly sync)
};


// ── ATHLETE ROSTER ──────────────────────────────────────────
//
//  How to get a refresh token for each athlete:
//  1. Send them this URL (swap in your CLIENT_ID):
//     https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all
//  2. They click Authorize — Strava redirects to a URL like:
//     http://localhost/?code=abc123xyz
//  3. They copy that "code" value and send it to you
//  4. Run exchangeCode('abc123xyz') in the Apps Script editor
//     to convert it to a refresh token, then paste below
//
//  Fields: name, stravaId, refreshToken
//  stravaId is optional but useful for profile links

var ATHLETES = [
  // ── CONFIRMED (replace refresh tokens as you collect them) ──
  { name: 'Ryan D.',    stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Blaine K.',  stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Tyler M.',   stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'B Mac',      stravaId: '',  refreshToken: 'PLACEHOLDER' },

  // ── SLOTS 5–60 (fill in as athletes join) ──────────────────
  { name: 'Athlete 05', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 06', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 07', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 08', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 09', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 10', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 11', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 12', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 13', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 14', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 15', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 16', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 17', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 18', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 19', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 20', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 21', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 22', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 23', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 24', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 25', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 26', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 27', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 28', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 29', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 30', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 31', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 32', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 33', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 34', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 35', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 36', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 37', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 38', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 39', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 40', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 41', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 42', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 43', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 44', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 45', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 46', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 47', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 48', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 49', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 50', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 51', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 52', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 53', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 54', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 55', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 56', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 57', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 58', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 59', stravaId: '',  refreshToken: 'PLACEHOLDER' },
  { name: 'Athlete 60', stravaId: '',  refreshToken: 'PLACEHOLDER' },
];


// ── RACE CALENDAR ────────────────────────────────────────────
//  Used only for the INITIAL sheet setup via setupSheets().
//  After that, manage races and signups directly in the Races
//  tab of the Google Sheet — no script edits needed.
//
//  To add a signup: open the Races tab, find the race row,
//  and add the athlete name to the Signups column (comma-separated).
//  The dashboard reads directly from the sheet.

var RACES = [
  {
    name:     'Prairie on Fire Backyard Ultra',
    date:     '2026-09-12',
    location: 'Noblesville, IN',
    distance: 'Backyard Ultra',
    signups:  [],
  },
  {
    name:     'Ironman Florida',
    date:     '2026-11-07',
    location: 'Panama City Beach, FL',
    distance: 'Full',
    signups:  [],
  },
  {
    name:     'Bootlegger 100',
    date:     '2027-03-20',
    location: 'Jackson, GA',
    distance: '100 Mile',
    signups:  [],
  },
  {
    name:     'Boulder 70.3',
    date:     '2027-06-01',
    location: 'Boulder, CO',
    distance: '70.3',
    signups:  [],
  },
];


// ── CHALLENGE HISTORY ────────────────────────────────────────

var CHALLENGES = [
  { name: 'May Consistency',  description: 'Train 5x/week all month',       status: 'active',    icon: 'flame'    },
  { name: 'Vert Challenge',   description: '50,000 ft climbing — team',      status: 'active',    icon: 'mountain' },
  { name: 'Spring Miles',     description: '500 team miles in April',        status: 'complete',  icon: 'trophy'   },
  { name: 'Swim February',    description: 'Swim every week of Feb',         status: 'complete',  icon: 'swim'     },
  { name: 'Turkey Trot',      description: 'Run on Thanksgiving',            status: 'complete',  icon: 'run'      },
];


// ============================================================
//  CORE FUNCTIONS — do not edit below unless you know JS
// ============================================================


// ── ONE-TIME SETUP ───────────────────────────────────────────

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Athletes tab
  var athletes = getOrCreateSheet(ss, 'Athletes');
  athletes.clearContents();
  athletes.getRange(1, 1, 1, 4).setValues([['Name', 'StravaID', 'RefreshToken', 'LastSync']]);
  athletes.getRange(1, 1, 1, 4).setFontWeight('bold');
  ATHLETES.forEach(function(a, i) {
    athletes.getRange(i + 2, 1, 1, 4).setValues([[a.name, a.stravaId, a.refreshToken, '']]);
  });

  // Activities tab
  var acts = getOrCreateSheet(ss, 'Activities');
  acts.clearContents();
  acts.getRange(1, 1, 1, 9).setValues([[
    'Athlete', 'Date', 'Week', 'Type', 'DistanceMiles', 'MovingTimeSecs', 'ElevationFeet', 'ActivityID', 'Name'
  ]]);
  acts.getRange(1, 1, 1, 9).setFontWeight('bold');

  // Weekly Summary tab
  var weekly = getOrCreateSheet(ss, 'WeeklySummary');
  weekly.clearContents();
  weekly.getRange(1, 1, 1, 8).setValues([[
    'Week', 'Athlete', 'Miles', 'Hours', 'Sessions', 'ElevationFeet', 'ActiveDays', 'ConsistencyPct'
  ]]);
  weekly.getRange(1, 1, 1, 8).setFontWeight('bold');

  // Races tab
  var races = getOrCreateSheet(ss, 'Races');
  races.clearContents();
  races.getRange(1, 1, 1, 5).setValues([['Name', 'Date', 'Location', 'Distance', 'Signups']]);
  races.getRange(1, 1, 1, 5).setFontWeight('bold');
  RACES.forEach(function(r, i) {
    races.getRange(i + 2, 1, 1, 5).setValues([[
      r.name, r.date, r.location, r.distance, r.signups.join(', ')
    ]]);
  });

  // Challenges tab
  var chal = getOrCreateSheet(ss, 'Challenges');
  chal.clearContents();
  chal.getRange(1, 1, 1, 4).setValues([['Name', 'Description', 'Status', 'Icon']]);
  chal.getRange(1, 1, 1, 4).setFontWeight('bold');
  CHALLENGES.forEach(function(c, i) {
    chal.getRange(i + 2, 1, 1, 4).setValues([[c.name, c.description, c.status, c.icon]]);
  });

  Logger.log('✅ All sheets created successfully.');
}


// ── MAIN SYNC ────────────────────────────────────────────────

function fullSync() {
  var ss      = SpreadsheetApp.getActiveSpreadsheet();
  var actSheet = ss.getSheetByName('Activities');
  var athSheet = ss.getSheetByName('Athletes');

  if (!actSheet || !athSheet) {
    Logger.log('❌ Sheets not found — run setupSheets() first.');
    return;
  }

  var now       = new Date();
  var weekStart = getMonday(now, CONFIG.WEEKS_BACK);
  var weekEnd   = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  var weekLabel = Utilities.formatDate(weekStart, 'UTC', 'yyyy-MM-dd');

  Logger.log('🔄 Syncing week: ' + weekLabel);

  // Remove existing rows for this week to avoid duplicates
  clearWeekFromSheet(actSheet, weekLabel);

  var newRows = [];

  ATHLETES.forEach(function(athlete) {
    if (athlete.refreshToken === 'PLACEHOLDER' || !athlete.refreshToken) {
      Logger.log('⏭  Skipping ' + athlete.name + ' — no token yet');
      return;
    }

    try {
      var accessToken = refreshAccessToken(athlete.refreshToken, athlete.name, athSheet);
      if (!accessToken) return;

      var activities = fetchActivities(accessToken, weekStart, weekEnd);

      activities.forEach(function(act) {
        var distMiles = metersToMiles(act.distance);
        var elevFeet  = metersToFeet(act.total_elevation_gain);
        var actDate   = new Date(act.start_date);

        newRows.push([
          athlete.name,
          Utilities.formatDate(actDate, 'UTC', 'yyyy-MM-dd'),
          weekLabel,
          normalizeType(act.type),
          parseFloat(distMiles.toFixed(2)),
          act.moving_time,
          parseFloat(elevFeet.toFixed(0)),
          act.id,
          act.name,
        ]);
      });

      Logger.log('✅ ' + athlete.name + ': ' + activities.length + ' activities');

    } catch (e) {
      Logger.log('❌ Error for ' + athlete.name + ': ' + e.message);
    }

    // Strava rate limit: 100 requests / 15 min. Sleep 1s between athletes.
    Utilities.sleep(1000);
  });

  // Write all rows at once (faster than one-by-one)
  if (newRows.length > 0) {
    var lastRow = actSheet.getLastRow();
    actSheet.getRange(lastRow + 1, 1, newRows.length, 9).setValues(newRows);
    Logger.log('📝 Wrote ' + newRows.length + ' activity rows');
  }

  buildWeeklySummary(weekLabel);
  Logger.log('🏁 Sync complete for week ' + weekLabel);
}


// ── WEEKLY SUMMARY BUILDER ───────────────────────────────────

function buildWeeklySummary(weekLabel) {
  var ss       = SpreadsheetApp.getActiveSpreadsheet();
  var actSheet = ss.getSheetByName('Activities');
  var sumSheet = ss.getSheetByName('WeeklySummary');

  // Load all activity data
  var data = actSheet.getDataRange().getValues();
  var headers = data[0];
  var col = {};
  headers.forEach(function(h, i) { col[h] = i; });

  // Filter to this week
  var weekRows = data.slice(1).filter(function(r) { return r[col['Week']] === weekLabel; });

  // Aggregate per athlete
  var byAthlete = {};
  weekRows.forEach(function(r) {
    var name = r[col['Athlete']];
    var date = r[col['Date']];
    if (!byAthlete[name]) {
      byAthlete[name] = { miles: 0, secs: 0, sessions: 0, elev: 0, days: {} };
    }
    byAthlete[name].miles    += parseFloat(r[col['DistanceMiles']]) || 0;
    byAthlete[name].secs     += parseInt(r[col['MovingTimeSecs']])  || 0;
    byAthlete[name].elev     += parseFloat(r[col['ElevationFeet']]) || 0;
    byAthlete[name].sessions += 1;
    byAthlete[name].days[date] = true;
  });

  // Remove existing summary rows for this week
  clearWeekFromSheet(sumSheet, weekLabel);

  // Write new summary rows
  var sumRows = [];
  Object.keys(byAthlete).forEach(function(name) {
    var d = byAthlete[name];
    var activeDays     = Object.keys(d.days).length;
    var consistencyPct = Math.round((activeDays / 7) * 100);
    sumRows.push([
      weekLabel,
      name,
      parseFloat(d.miles.toFixed(1)),
      parseFloat((d.secs / 3600).toFixed(1)),
      d.sessions,
      Math.round(d.elev),
      activeDays,
      consistencyPct,
    ]);
  });

  // Sort by miles descending (leaderboard order)
  sumRows.sort(function(a, b) { return b[2] - a[2]; });

  if (sumRows.length > 0) {
    var lastRow = sumSheet.getLastRow();
    sumSheet.getRange(lastRow + 1, 1, sumRows.length, 8).setValues(sumRows);
    Logger.log('📊 Summary built: ' + sumRows.length + ' athletes for ' + weekLabel);
  }
}


// ── STRAVA AUTH ──────────────────────────────────────────────

function refreshAccessToken(refreshToken, athleteName, athSheet) {
  var url      = 'https://www.strava.com/oauth/token';
  var payload  = {
    client_id:     CONFIG.CLIENT_ID,
    client_secret: CONFIG.CLIENT_SECRET,
    grant_type:    'refresh_token',
    refresh_token: refreshToken,
  };

  var options = {
    method:  'post',
    payload: payload,
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  var data     = JSON.parse(response.getContentText());

  if (data.errors) {
    Logger.log('❌ Auth failed for ' + athleteName + ': ' + JSON.stringify(data.errors));
    return null;
  }

  // If Strava returned a new refresh token, update the sheet
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    updateAthleteToken(athSheet, athleteName, data.refresh_token);
  }

  return data.access_token;
}

function updateAthleteToken(sheet, name, newToken) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === name) {
      sheet.getRange(i + 1, 3).setValue(newToken);
      sheet.getRange(i + 1, 4).setValue(new Date());
      break;
    }
  }
}

// Run this manually in the editor to convert an auth code to a refresh token.
// Paste the code from the Strava redirect URL, run the function,
// then copy the refresh_token from the Logs panel.
function exchangeCode(code) {
  var url     = 'https://www.strava.com/oauth/token';
  var payload = {
    client_id:     CONFIG.CLIENT_ID,
    client_secret: CONFIG.CLIENT_SECRET,
    code:          code,
    grant_type:    'authorization_code',
  };

  var response = UrlFetchApp.fetch(url, { method: 'post', payload: payload });
  var data     = JSON.parse(response.getContentText());

  Logger.log('refresh_token: ' + data.refresh_token);
  Logger.log('athlete name:  ' + data.athlete.firstname + ' ' + data.athlete.lastname);
  Logger.log('strava id:     ' + data.athlete.id);

  return data.refresh_token;
}


// ── STRAVA DATA FETCH ────────────────────────────────────────

function fetchActivities(accessToken, after, before) {
  var afterEpoch  = Math.floor(after.getTime()  / 1000);
  var beforeEpoch = Math.floor(before.getTime() / 1000);

  var url = 'https://www.strava.com/api/v3/athlete/activities'
    + '?after='    + afterEpoch
    + '&before='   + beforeEpoch
    + '&per_page=' + 100;

  var options = {
    method: 'get',
    headers: { Authorization: 'Bearer ' + accessToken },
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  var data     = JSON.parse(response.getContentText());

  if (!Array.isArray(data)) {
    Logger.log('⚠️  Unexpected response: ' + JSON.stringify(data));
    return [];
  }

  return data;
}


// ── UTILITIES ────────────────────────────────────────────────

function getMonday(date, weeksBack) {
  var d   = new Date(date);
  var day = d.getUTCDay();
  var diff = (day === 0 ? -6 : 1 - day) - ((weeksBack || 0) * 7);
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function metersToMiles(m) { return (m || 0) * 0.000621371; }
function metersToFeet(m)  { return (m || 0) * 3.28084;     }

function normalizeType(type) {
  var map = {
    Run: 'Run', VirtualRun: 'Run',
    Ride: 'Bike', VirtualRide: 'Bike', EBikeRide: 'Bike',
    Swim: 'Swim',
    Walk: 'Walk', Hike: 'Hike',
    WeightTraining: 'Strength', Workout: 'Strength',
    Yoga: 'Yoga',
  };
  return map[type] || type;
}

function getOrCreateSheet(ss, name) {
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function clearWeekFromSheet(sheet, weekLabel) {
  var data = sheet.getDataRange().getValues();
  // Walk backwards so row deletions don't shift indices
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === weekLabel || data[i][2] === weekLabel) {
      sheet.deleteRow(i + 1);
    }
  }
}


// ── TRIGGER INSTALLER ────────────────────────────────────────
//  Run this once to set the weekly auto-sync trigger.
//  After that it runs itself every Monday at 7am.

function installTrigger() {
  // Remove any existing fullSync triggers first
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'fullSync') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('fullSync')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .inTimezone('America/New_York')
    .create();

  Logger.log('✅ Nightly trigger installed — fullSync runs every night at 2am ET');
}


// ── DASHBOARD JSON EXPORT ────────────────────────────────────
//  Optional: run this to generate a JSON snapshot the dashboard
//  can read from Google Drive instead of direct Sheets API calls.

function exportDashboardJson() {
  var ss      = SpreadsheetApp.getActiveSpreadsheet();
  var now     = new Date();
  var weekLabel = Utilities.formatDate(getMonday(now, 0), 'UTC', 'yyyy-MM-dd');

  // Weekly summary for current week
  var sumSheet = ss.getSheetByName('WeeklySummary');
  var sumData  = sumSheet.getDataRange().getValues();
  var sumHdr   = sumData[0];
  var weekRows = sumData.slice(1).filter(function(r) { return r[0] === weekLabel; });

  var leaderboard = weekRows.map(function(r) {
    var obj = {};
    sumHdr.forEach(function(h, i) { obj[h] = r[i]; });
    return obj;
  });

  // Team totals
  var totalMiles    = leaderboard.reduce(function(s, r) { return s + (r.Miles    || 0); }, 0);
  var totalSessions = leaderboard.reduce(function(s, r) { return s + (r.Sessions || 0); }, 0);
  var avgConsistency = leaderboard.length
    ? Math.round(leaderboard.reduce(function(s, r) { return s + (r.ConsistencyPct || 0); }, 0) / leaderboard.length)
    : 0;

  // Races
  var raceSheet = ss.getSheetByName('Races');
  var raceData  = raceSheet.getDataRange().getValues();
  var raceHdr   = raceData[0];
  var races = raceData.slice(1).map(function(r) {
    var obj = {};
    raceHdr.forEach(function(h, i) { obj[h] = r[i]; });
    obj.Signups = obj.Signups ? obj.Signups.split(', ').filter(Boolean) : [];
    return obj;
  }).filter(function(r) { return new Date(r.Date) >= now; });

  // Challenges
  var chalSheet = ss.getSheetByName('Challenges');
  var chalData  = chalSheet.getDataRange().getValues();
  var chalHdr   = chalData[0];
  var challenges = chalData.slice(1).map(function(r) {
    var obj = {};
    chalHdr.forEach(function(h, i) { obj[h] = r[i]; });
    return obj;
  });

  var payload = {
    generatedAt:    now.toISOString(),
    week:           weekLabel,
    teamStats: {
      totalMiles:      parseFloat(totalMiles.toFixed(1)),
      activeAthletes:  leaderboard.length,
      totalSessions:   totalSessions,
      avgConsistency:  avgConsistency,
    },
    leaderboard: leaderboard,
    races:       races,
    challenges:  challenges,
  };

  // Save to a file called tribal_dashboard.json in the same Drive folder
  var json     = JSON.stringify(payload, null, 2);
  var fileName = 'tribal_dashboard.json';
  var files    = DriveApp.getFilesByName(fileName);

  if (files.hasNext()) {
    files.next().setContent(json);
    Logger.log('✅ Updated existing ' + fileName);
  } else {
    DriveApp.createFile(fileName, json, MimeType.PLAIN_TEXT);
    Logger.log('✅ Created new ' + fileName);
  }
}

// ── SIGNUP MANAGER ───────────────────────────────────────────
//  Manage race signups directly in the Races sheet.
//  No script edits needed after initial setup.
//
//  HOW TO ADD A SIGNUP:
//  1. Open the Races tab in your Google Sheet
//  2. Find the race row
//  3. Click the Signups cell and add the athlete name,
//     comma-separated (e.g. "Ryan D., Blaine K., Tyler M.")
//  4. That's it — the dashboard reads live from the sheet
//
//  HOW TO ADD A NEW RACE:
//  1. Open the Races tab
//  2. Add a new row with: Name, Date (YYYY-MM-DD), Location, Distance, Signups
//  3. Done — no script changes needed
//
//  HOW TO REMOVE A RACE:
//  1. Open the Races tab
//  2. Delete the row
//
//  The Races tab columns are:
//  A: Name  |  B: Date  |  C: Location  |  D: Distance  |  E: Signups


// ── RACE SHEET VALIDATOR ─────────────────────────────────────
//  Run this anytime to check your Races tab for formatting issues.

function validateRaces() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Races');
  if (!sheet) { Logger.log('❌ Races sheet not found'); return; }

  var data = sheet.getDataRange().getValues();
  var issues = [];

  data.slice(1).forEach(function(r, i) {
    var row = i + 2;
    if (!r[0]) issues.push('Row ' + row + ': missing race name');
    if (!r[1]) {
      issues.push('Row ' + row + ': missing date');
    } else {
      var d = new Date(r[1]);
      if (isNaN(d.getTime())) issues.push('Row ' + row + ': invalid date "' + r[1] + '" — use YYYY-MM-DD');
    }
    if (!r[3]) issues.push('Row ' + row + ': missing distance/type');
  });

  if (issues.length === 0) {
    Logger.log('✅ Races tab looks good — ' + (data.length - 1) + ' races found');
  } else {
    issues.forEach(function(i) { Logger.log('⚠️  ' + i); });
  }
}


// ── ATHLETE SHEET VALIDATOR ──────────────────────────────────
//  Run this to see how many athletes have real tokens vs placeholders.

function validateAthletes() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Athletes');
  if (!sheet) { Logger.log('❌ Athletes sheet not found'); return; }

  var data  = sheet.getDataRange().getValues().slice(1);
  var ready = data.filter(function(r) { return r[2] && r[2] !== 'PLACEHOLDER'; });
  var pending = data.filter(function(r) { return !r[2] || r[2] === 'PLACEHOLDER'; });

  Logger.log('✅ Ready to sync:  ' + ready.length + ' athletes');
  Logger.log('⏳ Awaiting token: ' + pending.length + ' athletes');
  if (pending.length > 0) {
    Logger.log('   Pending: ' + pending.map(function(r) { return r[0]; }).join(', '));
  }
}
