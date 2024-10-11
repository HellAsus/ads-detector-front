import TranscriptionItem from "./TranscriptionItem";

type Props = {
  transcriptions: string[];
};

export default function TranscriptionList({ transcriptions }: Props) {
  return (
    <div className="flex flex-col gap-3 overflow-auto h-[600px]">
      {transcriptions.map((transcript, index) => (
        <TranscriptionItem key={index} transcript={transcript} />
      ))}
    </div>
  );
}
