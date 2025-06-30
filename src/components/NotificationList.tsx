import React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Notification = {
  id: number;
  message: string;
  date: string;
  read: boolean;
};

type Props = {
  notifications: Notification[];
  onMarkRead: (id: number) => void;
};

const NotificationList: React.FC<Props> = ({ notifications, onMarkRead }) => (
  <div className="w-80 bg-white rounded shadow-lg p-4">
    <div className="flex items-center mb-3">
      <Bell className="mr-2 text-indigo-600" />
      <span className="font-bold text-indigo-700">Notifikasi</span>
    </div>
    {notifications.length === 0 ? (
      <div className="text-gray-400 text-center py-8">Tidak ada notifikasi</div>
    ) : (
      <ul className="space-y-2">
        {notifications.map((notif) => (
          <li key={notif.id} className={`p-2 rounded ${notif.read ? "bg-gray-50" : "bg-indigo-50"}`}>
            <div className="flex justify-between items-center">
              <span>{notif.message}</span>
              {!notif.read && (
                <Badge className="ml-2 cursor-pointer" onClick={() => onMarkRead(notif.id)}>
                  Baru
                </Badge>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1">{notif.date}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NotificationList;
