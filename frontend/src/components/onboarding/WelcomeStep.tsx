import Button from "../common/Button";

interface Props {
  onContinue: () => void;
}

export default function WelcomeStep({ onContinue }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-[#262626] mb-3">
          Welcome to Narrative by Design
        </h2>
        <p className="text-[#525252] text-lg">
          Take a few minutes to explore your story and how you want to share it.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-md p-8 mb-6 space-y-4 text-[#525252] leading-relaxed">
        <p>
          This workshop will guide you through a few short reflection steps, then
          help you connect your experiences to the values that matter most to you.
        </p>
        <p>
          By the end, you will have a stronger, more personal response to
          "Tell me about yourself" that still sounds like you.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onContinue}>Get Started</Button>
      </div>
    </div>
  );
}
