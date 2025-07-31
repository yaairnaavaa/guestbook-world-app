"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Wallet, Send, Globe } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthButton } from '@/components/AuthButton';

interface GuestbookEntry {
  id: string
  address: string
  name: string
  message: string
  timestamp: Date
}

export default function WorldChainGuestbook() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [userName, setUserName] = useState("")
  const [userMessage, setUserMessage] = useState("")
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Simular datos iniciales del guestbook
  useEffect(() => {
    const mockEntries: GuestbookEntry[] = [
      {
        id: "1",
        address: "0x1234...5678",
        name: "Alice",
        message: "¡Hola World Chain! Excited to be part of this amazing ecosystem 🌍",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "2",
        address: "0xabcd...efgh",
        name: "Bob",
        message: "Building the future of decentralized identity, one block at a time! 🚀",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: "3",
        address: "0x9876...4321",
        name: "Charlie",
        message: "World Chain is revolutionizing how we think about digital identity. Amazing work! 💫",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ]
    setEntries(mockEntries)
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Simular conexión de wallet
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockAddress =
        "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4)
      setUserAddress(mockAddress)
      setIsConnected(true)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockAddress}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setUserAddress("")
    setUserName("")
    setUserMessage("")
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet",
    })
  }

  const submitMessage = async () => {
    if (!userName.trim() || !userMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both name and message fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simular transacción en blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        address: userAddress,
        name: userName,
        message: userMessage,
        timestamp: new Date(),
      }

      setEntries((prev) => [newEntry, ...prev])
      setUserName("")
      setUserMessage("")

      toast({
        title: "Message Added!",
        description: "Your message has been added to the guestbook.",
      })
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to add message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              World Chain Guestbook
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect your wallet and leave a message for the World Chain community. Share your thoughts, experiences, or
            just say hello! 🌍
          </p>
        </div>

        {/* Wallet Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
            <CardDescription>Connect your World Chain compatible wallet to participate</CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <AuthButton />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {userAddress.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Connected</p>
                    <p className="text-sm text-gray-500">{userAddress}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Message Form */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Add Your Message
              </CardTitle>
              <CardDescription>Share your thoughts with the World Chain community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={50}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Share your thoughts about World Chain..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  maxLength={500}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">{userMessage.length}/500 characters</p>
              </div>
              <Button
                onClick={submitMessage}
                disabled={isLoading || !userName.trim() || !userMessage.trim()}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Adding Message..." : "Add Message"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Messages List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Messages
              <Badge variant="secondary">{entries.length}</Badge>
            </CardTitle>
            <CardDescription>Messages from the World Chain community</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Be the first to leave one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, index) => (
                  <div key={entry.id}>
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600">
                          {entry.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{entry.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.address}
                          </Badge>
                          <span className="text-sm text-gray-500">{formatTimeAgo(entry.timestamp)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{entry.message}</p>
                      </div>
                    </div>
                    {index < entries.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>Built for World Chain • Connecting humanity through blockchain</p>
        </div>
      </div>
    </div>
  )
}
