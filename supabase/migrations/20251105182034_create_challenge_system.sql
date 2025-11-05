/*
  # Create Virtus Challenge System

  1. New Tables
    - `challenge_participants`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `started_at` (timestamptz)
      - `current_day` (integer)
      - `completed` (boolean)
      - `created_at` (timestamptz)
    
    - `challenge_progress`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, references challenge_participants)
      - `day_number` (integer, 1-30)
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
    
    - `challenge_workouts`
      - `id` (uuid, primary key)
      - `day_number` (integer)
      - `title` (text)
      - `description` (text)
      - `exercises` (jsonb)
      - `difficulty` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to workout data
*/

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  started_at timestamptz DEFAULT now(),
  current_day integer DEFAULT 1,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create challenge_progress table
CREATE TABLE IF NOT EXISTS challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES challenge_participants(id) ON DELETE CASCADE,
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_id, day_number)
);

-- Create challenge_workouts table
CREATE TABLE IF NOT EXISTS challenge_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number integer NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 30),
  title text NOT NULL,
  description text NOT NULL,
  exercises jsonb NOT NULL DEFAULT '[]',
  difficulty text DEFAULT 'intermediate',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_workouts ENABLE ROW LEVEL SECURITY;

-- Policies for challenge_participants
CREATE POLICY "Users can view their own participant record"
  ON challenge_participants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own participant record"
  ON challenge_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant record"
  ON challenge_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for challenge_progress
CREATE POLICY "Users can view their own progress"
  ON challenge_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenge_participants
      WHERE challenge_participants.id = challenge_progress.participant_id
      AND challenge_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own progress"
  ON challenge_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenge_participants
      WHERE challenge_participants.id = challenge_progress.participant_id
      AND challenge_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own progress"
  ON challenge_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM challenge_participants
      WHERE challenge_participants.id = challenge_progress.participant_id
      AND challenge_participants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenge_participants
      WHERE challenge_participants.id = challenge_progress.participant_id
      AND challenge_participants.user_id = auth.uid()
    )
  );

-- Policies for challenge_workouts (public read access)
CREATE POLICY "Anyone can view workouts"
  ON challenge_workouts FOR SELECT
  TO authenticated
  USING (true);

-- Insert 30 days of workouts
INSERT INTO challenge_workouts (day_number, title, description, exercises, difficulty) VALUES
(1, 'Foundation Day', 'Build your baseline strength and establish proper form', '[{"name":"Push-ups","reps":"3 sets x 10-15 reps"},{"name":"Bodyweight Squats","reps":"3 sets x 15 reps"},{"name":"Plank Hold","reps":"3 sets x 30 seconds"},{"name":"Jumping Jacks","reps":"2 sets x 20 reps"}]', 'beginner'),
(2, 'Lower Body Focus', 'Develop leg strength and stability', '[{"name":"Walking Lunges","reps":"3 sets x 10 each leg"},{"name":"Glute Bridges","reps":"3 sets x 15 reps"},{"name":"Wall Sit","reps":"3 sets x 45 seconds"},{"name":"Calf Raises","reps":"3 sets x 20 reps"}]', 'beginner'),
(3, 'Upper Body Push', 'Build pushing strength in chest and shoulders', '[{"name":"Push-ups","reps":"4 sets x 12 reps"},{"name":"Pike Push-ups","reps":"3 sets x 8 reps"},{"name":"Tricep Dips","reps":"3 sets x 10 reps"},{"name":"Plank to Down Dog","reps":"3 sets x 10 reps"}]', 'beginner'),
(4, 'Core Strength', 'Develop a strong, stable core', '[{"name":"Plank Hold","reps":"3 sets x 45 seconds"},{"name":"Side Plank","reps":"3 sets x 30 seconds each side"},{"name":"Dead Bug","reps":"3 sets x 12 reps"},{"name":"Mountain Climbers","reps":"3 sets x 20 reps"}]', 'beginner'),
(5, 'Active Recovery', 'Light movement and mobility work', '[{"name":"Dynamic Stretching","reps":"10 minutes"},{"name":"Yoga Flow","reps":"15 minutes"},{"name":"Light Walking","reps":"20 minutes"},{"name":"Foam Rolling","reps":"10 minutes"}]', 'beginner'),
(6, 'Pull Strength', 'Build pulling strength in back and arms', '[{"name":"Inverted Rows","reps":"4 sets x 8-10 reps"},{"name":"Band Pull-aparts","reps":"3 sets x 15 reps"},{"name":"Scapular Pull-ups","reps":"3 sets x 8 reps"},{"name":"Bicep Curls","reps":"3 sets x 12 reps"}]', 'intermediate'),
(7, 'Full Body Circuit', 'Combine all movement patterns', '[{"name":"Burpees","reps":"3 sets x 10 reps"},{"name":"Jump Squats","reps":"3 sets x 12 reps"},{"name":"Push-ups","reps":"3 sets x 15 reps"},{"name":"Plank Jacks","reps":"3 sets x 20 reps"}]', 'intermediate'),
(8, 'Endurance Builder', 'Improve muscular endurance', '[{"name":"Push-ups","reps":"100 total reps"},{"name":"Squats","reps":"150 total reps"},{"name":"Plank Hold","reps":"5 minutes total"},{"name":"Jumping Jacks","reps":"200 total reps"}]', 'intermediate'),
(9, 'Power Development', 'Explosive strength training', '[{"name":"Plyometric Push-ups","reps":"4 sets x 6 reps"},{"name":"Box Jumps","reps":"4 sets x 8 reps"},{"name":"Broad Jumps","reps":"4 sets x 5 reps"},{"name":"Speed Skaters","reps":"3 sets x 20 reps"}]', 'intermediate'),
(10, 'Milestone Test', 'Assess your progress', '[{"name":"Max Push-ups","reps":"1 set to failure"},{"name":"Max Squats","reps":"1 set to failure"},{"name":"Max Plank Hold","reps":"1 set for time"},{"name":"Max Pull-ups","reps":"1 set to failure"}]', 'intermediate'),
(11, 'Upper Body Volume', 'High volume pushing work', '[{"name":"Push-ups","reps":"5 sets x 15 reps"},{"name":"Diamond Push-ups","reps":"4 sets x 10 reps"},{"name":"Decline Push-ups","reps":"3 sets x 12 reps"},{"name":"Shoulder Taps","reps":"3 sets x 20 reps"}]', 'intermediate'),
(12, 'Lower Body Power', 'Explosive leg training', '[{"name":"Jump Squats","reps":"5 sets x 10 reps"},{"name":"Bulgarian Split Squats","reps":"4 sets x 12 each leg"},{"name":"Single Leg Deadlifts","reps":"3 sets x 10 each leg"},{"name":"Box Step-ups","reps":"3 sets x 15 each leg"}]', 'intermediate'),
(13, 'Pull Focus Day', 'Maximum pulling volume', '[{"name":"Pull-ups","reps":"5 sets x max reps"},{"name":"Australian Pull-ups","reps":"4 sets x 12 reps"},{"name":"Face Pulls","reps":"4 sets x 15 reps"},{"name":"Bent Over Rows","reps":"4 sets x 12 reps"}]', 'advanced'),
(14, 'Core Mastery', 'Advanced core training', '[{"name":"L-Sit Hold","reps":"5 sets x 20 seconds"},{"name":"Hollow Body Hold","reps":"4 sets x 30 seconds"},{"name":"Dragon Flags","reps":"3 sets x 5 reps"},{"name":"Russian Twists","reps":"3 sets x 30 reps"}]', 'advanced'),
(15, 'Active Recovery', 'Mobility and light movement', '[{"name":"Yoga Flow","reps":"20 minutes"},{"name":"Dynamic Stretching","reps":"15 minutes"},{"name":"Light Cardio","reps":"20 minutes"},{"name":"Mobility Work","reps":"15 minutes"}]', 'beginner'),
(16, 'Strength Conditioning', 'Build work capacity', '[{"name":"EMOM Push-ups","reps":"10 minutes x 10 reps"},{"name":"EMOM Squats","reps":"10 minutes x 15 reps"},{"name":"EMOM Burpees","reps":"10 minutes x 8 reps"},{"name":"Plank Hold","reps":"3 minutes"}]', 'advanced'),
(17, 'Calisthenics Skills', 'Work on advanced movements', '[{"name":"Handstand Practice","reps":"5 sets x 30 seconds"},{"name":"L-Sit Progression","reps":"5 sets x 20 seconds"},{"name":"Muscle-up Progressions","reps":"5 sets x 5 reps"},{"name":"Pistol Squat Practice","reps":"5 sets x 5 each leg"}]', 'advanced'),
(18, 'High Intensity Circuit', 'Maximum effort circuit', '[{"name":"Burpee Pull-ups","reps":"4 rounds x 10 reps"},{"name":"Jump Squats","reps":"4 rounds x 15 reps"},{"name":"Mountain Climbers","reps":"4 rounds x 30 reps"},{"name":"Plank Hold","reps":"4 rounds x 60 seconds"}]', 'advanced'),
(19, 'Upper Body Strength', 'Pure strength focus', '[{"name":"Weighted Push-ups","reps":"5 sets x 8 reps"},{"name":"Archer Push-ups","reps":"4 sets x 6 each side"},{"name":"Pike Push-ups","reps":"4 sets x 10 reps"},{"name":"Pseudo Planche Push-ups","reps":"3 sets x 5 reps"}]', 'advanced'),
(20, 'Checkpoint Test', 'Progress assessment', '[{"name":"Max Push-ups 2 min","reps":"1 set for reps"},{"name":"Max Pull-ups","reps":"1 set to failure"},{"name":"Max Plank Hold","reps":"1 set for time"},{"name":"Max Burpees 3 min","reps":"1 set for reps"}]', 'advanced'),
(21, 'Full Body Strength', 'Total body power', '[{"name":"One-Arm Push-ups","reps":"5 sets x 5 each side"},{"name":"Pistol Squats","reps":"5 sets x 8 each leg"},{"name":"Pull-ups","reps":"5 sets x 10 reps"},{"name":"Hanging Leg Raises","reps":"4 sets x 12 reps"}]', 'advanced'),
(22, 'Endurance Challenge', 'Test your stamina', '[{"name":"Push-ups","reps":"200 total reps"},{"name":"Squats","reps":"300 total reps"},{"name":"Pull-ups","reps":"50 total reps"},{"name":"Plank Hold","reps":"10 minutes total"}]', 'advanced'),
(23, 'Explosive Power', 'Maximum power output', '[{"name":"Clapping Push-ups","reps":"5 sets x 8 reps"},{"name":"Box Jumps","reps":"5 sets x 10 reps"},{"name":"Explosive Pull-ups","reps":"5 sets x 6 reps"},{"name":"Broad Jumps","reps":"5 sets x 8 reps"}]', 'advanced'),
(24, 'Skill Development', 'Advanced calisthenics', '[{"name":"Handstand Push-ups","reps":"5 sets x 5 reps"},{"name":"Front Lever Progressions","reps":"5 sets x 10 seconds"},{"name":"Planche Progressions","reps":"5 sets x 15 seconds"},{"name":"Human Flag Practice","reps":"5 sets x 10 seconds"}]', 'advanced'),
(25, 'Recovery Week', 'Active recovery and mobility', '[{"name":"Light Yoga","reps":"30 minutes"},{"name":"Swimming or Walking","reps":"30 minutes"},{"name":"Stretching","reps":"20 minutes"},{"name":"Meditation","reps":"10 minutes"}]', 'beginner'),
(26, 'Power Circuit', 'High intensity training', '[{"name":"Muscle-ups","reps":"5 sets x 5 reps"},{"name":"Pistol Squats","reps":"5 sets x 10 each leg"},{"name":"Handstand Push-ups","reps":"5 sets x 8 reps"},{"name":"Toes to Bar","reps":"5 sets x 12 reps"}]', 'advanced'),
(27, 'Strength Endurance', 'Long duration sets', '[{"name":"Push-ups","reps":"5 sets x 30 reps"},{"name":"Pull-ups","reps":"5 sets x 15 reps"},{"name":"Squats","reps":"5 sets x 50 reps"},{"name":"Plank Hold","reps":"5 sets x 2 minutes"}]', 'advanced'),
(28, 'Final Test Prep', 'Prepare for final assessment', '[{"name":"Push-ups","reps":"3 sets x 20 reps"},{"name":"Pull-ups","reps":"3 sets x 12 reps"},{"name":"Burpees","reps":"3 sets x 15 reps"},{"name":"Core Work","reps":"20 minutes"}]', 'advanced'),
(29, 'Rest and Reflect', 'Mental preparation', '[{"name":"Light Stretching","reps":"20 minutes"},{"name":"Meditation","reps":"15 minutes"},{"name":"Goal Review","reps":"15 minutes"},{"name":"Visualization","reps":"10 minutes"}]', 'beginner'),
(30, 'Final Challenge', 'Prove your transformation', '[{"name":"Max Push-ups 2 min","reps":"1 set for reps"},{"name":"Max Pull-ups","reps":"1 set to failure"},{"name":"5-Minute Plank Hold","reps":"1 set for time"},{"name":"100 Burpees","reps":"1 set for time"}]', 'advanced')
ON CONFLICT (day_number) DO NOTHING;