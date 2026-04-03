import { useEffect, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface Message {
  id: string;
  user_id: string;
  message: string;
  admin_reply?: string;
  created_at: string;
  replied_at?: string;
}

const SupportChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
  }, [user]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // For now, we'll use feedback table as messages
      // In production, you'd want a dedicated messages table
      const { data } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (data) {
        setMessages(data.map(f => ({
          id: f.id,
          user_id: f.user_id,
          message: f.message,
          admin_reply: f.admin_reply || undefined,
          created_at: f.created_at,
          replied_at: f.replied_at || undefined,
        })));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from("feedback")
        .insert({
          user_id: user.id,
          name: user.user_metadata?.full_name || "User",
          email: user.email || "",
          message: newMessage,
          rating: 5, // Default rating for support messages
        });

      if (error) throw error;

      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been sent to support. We'll respond soon.",
      });
      fetchMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Support Chat
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Message */}
          <Card className="gradient-card border-border lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
              />
              <Button 
                onClick={sendMessage} 
                disabled={sending || !newMessage.trim()}
                className="w-full"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Message History */}
          <Card className="gradient-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Message History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet. Send us a message to get started!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">You</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mb-3">{msg.message}</p>
                      
                      {msg.admin_reply && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-primary">Support Team</span>
                            <span className="text-xs text-muted-foreground">
                              {msg.replied_at ? new Date(msg.replied_at).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <p className="text-sm">{msg.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportChat;