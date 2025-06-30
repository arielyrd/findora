import React from "react";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";

type FoundItem = {
  id: number;
  name: string;
  brand?: string;
  color?: string;
  category: string;
  locationFound: string;
  foundDate: string;
  description?: string;
  photoUrl?: string;
  status: string;
  createdAt: string;
};

type Props = {
  item: FoundItem;
};

const ItemDetail: React.FC<Props> = ({ item }) => (
  <div>
    <div className="flex gap-4 mb-4">
      {item.photoUrl ? (
        <img src={item.photoUrl} alt={item.name} className="w-32 h-32 object-cover rounded border" />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded border">
          <ImageIcon className="text-gray-400" size={40} />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">{item.name}</h2>
        <Badge className="mt-2">{item.status}</Badge>
        <div className="text-gray-500 mt-2">{item.category}</div>
        <div className="text-gray-500">{item.locationFound}</div>
        <div className="text-gray-400 text-xs">{new Date(item.foundDate).toLocaleDateString()}</div>
      </div>
    </div>
    <div>
      <div className="font-semibold mb-1">Deskripsi:</div>
      <div className="text-gray-700">{item.description || "-"}</div>
    </div>
  </div>
);

export default ItemDetail;
