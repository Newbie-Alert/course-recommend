import WorkoutScreen from "@/components/workout/WorkoutScreen";
import RunProvider from "@/providers/RunProvider";

export default function Workout() {
  return (
    <RunProvider>
      <WorkoutScreen />
    </RunProvider>
  );
}
