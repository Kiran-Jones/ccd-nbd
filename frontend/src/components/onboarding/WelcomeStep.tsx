import Button from "../common/Button";

interface Props {
  onContinue: () => void;
}

export default function WelcomeStep({ onContinue }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl text-[#262626] mb-3">
          Narrative by Design
        </h2>
        <p className="text-[#525252] text-lg">
          A guided workshop to help you craft a clear, confident career story.
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-md p-8 mb-6 space-y-4 text-[#525252] leading-relaxed">
        <p>
          You will reflect on your identity, organize your experiences, and
          identify the values that anchor your story.
        </p>
        <p>
          By the end, you will write an interview-ready response to "Tell me
          about yourself" in your own voice.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onContinue}>Get Started</Button>
      </div>
    </div>
  );
}
