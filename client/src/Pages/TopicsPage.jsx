import { TopicCard } from '@/Components';
import { topics } from '@/DummyData/topics';

export default function TopicsPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {topics?.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
            ))}
        </div>
    );
}
