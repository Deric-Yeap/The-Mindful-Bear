import json
from datetime import datetime
def get_average_duration(period_sessions):
        session_dict = {}
        # Calculate the session count
        # Calculate the average duration of sessions
        sgt_format = '%Y-%m-%d %H:%M:%S'


        for key, data in period_sessions.items():
            # Assuming each session in 'sessions' has 'start_datetime' and 'end_datetime' fields
            session_details = data['sessions']
            total_duration_seconds = sum(
            (datetime.strptime(session['end_datetime_sgt'], sgt_format) - datetime.strptime(session['start_datetime_sgt'], sgt_format)).total_seconds()  for session in data['sessions']
                        )
            total_duration_minutes = total_duration_seconds / 60  # Convert to minutes
            
            # Add the total duration to the period data if needed
            session_count = data['session_count'] 

            # Print out results for each period
            print(f"Period: {key}")
            print(f"Total Duration (minutes): {total_duration_minutes}")

        
        # # Calculate the total duration of sessions in minutes
        # total_duration_seconds = sum([(session.end_datetime - session.start_datetime).total_seconds() for session in session_details])
        # total_duration_minutes = total_duration_seconds / 60  # Convert to minutes

            avg_duration = total_duration_minutes / session_count if session_count > 0 else 0

            # Prepare the data for this period
            session_dict[key] = {
                'session_count': session_count,
                'average_duration': avg_duration,  # Convert to minutes
                'sessions': session_details # Serialize the sessions
            }
        print("session_dict",session_dict)
        return session_dict
