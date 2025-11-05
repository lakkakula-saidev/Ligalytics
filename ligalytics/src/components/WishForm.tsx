import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Team, WishFormValues } from "../types";

const RULE_OPTIONS = [
  { value: "same-day-home", label: "Same day home" },
  { value: "same-weekend-home", label: "Same weekend home" },
  { value: "not-same-day-home", label: "Not same day home" },
  {
    value: "not-same-weekend-home",
    label: "Not same weekend home"
  }
] as const;

interface WishFormProps {
  teams: Team[];
  onSubmit: (values: WishFormValues) => void;
}

const defaultValues: WishFormValues = {
  teamA: "",
  teamB: "",
  startDate: "",
  endDate: "",
  rule: RULE_OPTIONS[0].value,
  comment: ""
};

const WishForm = ({ teams, onSubmit }: WishFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<WishFormValues>({
    mode: "onBlur",
    defaultValues
  });

  const teamOptions = useMemo(
    () =>
      teams.map((team) => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      )),
    [teams]
  );

  const onFormSubmit = handleSubmit((values) => {
    onSubmit({
      ...values,
      comment: values.comment.trim(),
    });
    reset({ ...defaultValues, rule: values.rule });
  });

  const selectedTeamA = watch("teamA");
  const startDateValue = watch("startDate");

  return (
    <form className="wish-form" onSubmit={onFormSubmit} noValidate>
      <fieldset disabled={isSubmitting}>
        <legend>Enter new pairing request</legend>
        <div className="form-grid">
          <label>
            Team A
            <select
              {...register("teamA", {
                required: "Please select Team A"
              })}
            >
              <option value="">Please Select</option>
              {teamOptions}
            </select>
            {errors.teamA && (
              <span className="error">{errors.teamA.message}</span>
            )}
          </label>

          <label>
            Team B
            <select
              {...register("teamB", {
                required: "Please select Team B",
                validate: (value) =>
                  value !== selectedTeamA ||
                  "Team A and Team B must be different"
              })}
            >
              <option value="">Please Select</option>
              {teamOptions}
            </select>
            {errors.teamB && (
              <span className="error">{errors.teamB.message}</span>
            )}
          </label>

          <label>
            Start Date
            <input
              type="date"
              {...register("startDate", {
                required: "Please select a start date"
              })}
            />
            {errors.startDate && (
              <span className="error">{errors.startDate.message}</span>
            )}
          </label>

          <label>
            End Date
            <input
              type="date"
              {...register("endDate", {
                required: "Please select an end date",
                validate: (value) => {
                  if (!value || !startDateValue) {
                    return true;
                  }
                  const start = new Date(startDateValue);
                  const end = new Date(value);
                  return (
                    end >= start || "End Date must not be before Start Date"
                  );
                }
              })}
            />
            {errors.endDate && (
              <span className="error">{errors.endDate.message}</span>
            )}
          </label>

          <label>
            Regel
            <select
              {...register("rule", {
                required: "Please select a rule"
              })}
            >
              {RULE_OPTIONS.map((rule) => (
                <option key={rule.value} value={rule.value}>
                  {rule.label}
                </option>
              ))}
            </select>
            {errors.rule && (
              <span className="error">{errors.rule.message}</span>
            )}
          </label>

          <label className="full-width">
            Comments (optional)
            <textarea
              rows={3}
              placeholder="Add notes or context"
              {...register("comment")}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save pair</button>
          <button
            type="button"
            className="secondary"
            onClick={() => reset(defaultValues)}
            disabled={isSubmitting}
          >
            Reset form
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default WishForm;
