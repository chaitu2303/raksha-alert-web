import { useEffect, useState } from "react";
import { Star, MessageSquare, Reply, Send, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  created_at: string;
  admin_reply?: string;
  replied_at?: string;
  user_id?: string;
}

const AdminFeedback = () => {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setFeedbacks(data as Feedback[]);
    setLoading(false);
  };

  const sendReply = async (feedbackId: string) => {
    if (!replyText.trim()) return;

    setSendingReply(true);
    try {
      const { error } = await supabase
        .from("feedback")
        .update({
          admin_reply: replyText,
          replied_at: new Date().toISOString(),
        })
        .eq("id", feedbackId);

      if (error) throw error;

      toast({
        title: "Reply sent",
        description: "Your reply has been sent to the user.",
      });
      setReplyText("");
      setReplyingTo(null);
      fetchFeedback();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingReply(false);
    }
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : "0";

  const supportMessages = feedbacks.filter(f => f.user_id); // Messages from support chat
  const regularFeedback = feedbacks.filter(f => !f.user_id); // Regular feedback

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          User Communication & Feedback
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="gradient-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary text-yellow-500">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{regularFeedback.length}</p>
                <p className="text-sm text-muted-foreground">Feedback</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary text-green-500">
                <Reply className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{supportMessages.length}</p>
                <p className="text-sm text-muted-foreground">Support Msgs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gradient-card border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary text-orange-500">
                <Send className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{feedbacks.filter(f => f.admin_reply).length}</p>
                <p className="text-sm text-muted-foreground">Replied</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Messages */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Messages ({supportMessages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {supportMessages.length === 0 ? (
              <p className="text-muted-foreground">No support messages yet.</p>
            ) : (
              <div className="space-y-4">
                {supportMessages.map((f) => (
                  <div key={f.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.email}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(f.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{f.message}</p>

                    {f.admin_reply ? (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-primary">Your Reply</span>
                          <span className="text-xs text-muted-foreground">
                            {f.replied_at ? new Date(f.replied_at).toLocaleString() : ""}
                          </span>
                        </div>
                        <p className="text-sm">{f.admin_reply}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {replyingTo === f.id ? (
                          <>
                            <Textarea
                              placeholder="Type your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => sendReply(f.id)}
                                disabled={sendingReply || !replyText.trim()}
                              >
                                {sendingReply ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReplyingTo(f.id)}
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Regular Feedback */}
        <Card className="gradient-card border-border">
          <CardHeader>
            <CardTitle>Regular Feedback ({regularFeedback.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {regularFeedback.length === 0 ? (
              <p className="text-muted-foreground">No feedback received yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {regularFeedback.map((f) => (
                  <Card key={f.id} className="border border-border">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{f.name}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${s <= f.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{f.email}</p>
                      <p className="text-sm text-foreground/80">{f.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminFeedback;
