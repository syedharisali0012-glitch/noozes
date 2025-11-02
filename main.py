import os
from flask import Flask, send_file, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

# --- Constants ---
SLEEP_CYCLE_MINUTES = 90
FALL_ASLEEP_BUFFER_MINUTES = 15

# --- Helper Functions ---
def calculate_wake_up_times(from_time):
    """Calculates optimal wake-up times based on sleep cycles."""
    wake_up_times = []
    # Start with the fall-asleep buffer
    current_time = from_time + timedelta(minutes=FALL_ASLEEP_BUFFER_MINUTES)
    # Calculate 6 cycles
    for i in range(1, 7):
        current_time += timedelta(minutes=SLEEP_CYCLE_MINUTES)
        wake_up_times.append(current_time.strftime("%-I:%M %p"))
    return wake_up_times

def calculate_bed_times(wake_up_time):
    """Calculates optimal bed times based on a desired wake-up time."""
    bed_times = []
    current_time = wake_up_time
    # Calculate 6 cycles backward
    for i in range(1, 7):
        current_time -= timedelta(minutes=SLEEP_CYCLE_MINUTES)
        # Account for falling asleep time
        bed_time = current_time - timedelta(minutes=FALL_ASLEEP_BUFFER_MINUTES)
        bed_times.append(bed_time.strftime("%-I:%M %p"))
    return bed_times

# --- API Routes ---
@app.route("/")
def index():
    """Serves the main HTML file."""
    return send_file('src/index.html')

@app.route("/api/calculate-from-now", methods=['POST'])
def calculate_from_now():
    """Calculates wake-up times starting from the current server time."""
    now = datetime.now()
    times = calculate_wake_up_times(now)
    return jsonify({"suggestions": times})

@app.route("/api/calculate-wake-up", methods=['POST'])
def calculate_wake_up_endpoint():
    """Calculates wake-up times from a given bedtime."""
    data = request.get_json()
    try:
        bed_time_str = data['time']
        # Use a dummy date to parse the time
        bed_time = datetime.strptime(bed_time_str, "%H:%M")
        times = calculate_wake_up_times(bed_time)
        return jsonify({"suggestions": times})
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid time format. Please use HH:MM."}), 400

@app.route("/api/calculate-bedtime", methods=['POST'])
def calculate_bedtime_endpoint():
    """Calculates bedtimes from a given wake-up time."""
    data = request.get_json()
    try:
        wake_up_str = data['time']
        # Use a dummy date to parse the time
        wake_up_time = datetime.strptime(wake_up_str, "%H:%M")
        times = calculate_bed_times(wake_up_time)
        return jsonify({"suggestions": list(reversed(times))}) # Show earliest first
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid time format. Please use HH:MM."}), 400

# --- Main Execution ---
def main():
    """Starts the Flask server."""
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

if __name__ == "__main__":
    main()
