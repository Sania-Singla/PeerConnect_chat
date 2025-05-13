import { useChatContext } from '@/Context';
import { ChatSettings, GroupSettings } from '@/Components';

export default function Settings() {
    const { selectedChat } = useChatContext();

    return (
        <div className="p-4 w-full">
            {selectedChat.chat.isGroupChat ? (
                <GroupSettings />
            ) : (
                <ChatSettings />
            )}
        </div>
    );
}
