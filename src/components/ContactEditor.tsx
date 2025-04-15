import  { useState } from 'react';
import {  Pencil} from 'lucide-react';

interface ContactEditorProps {
  initialContactCel: string;
  handleContactCel: (vehicleId:string, newContactCel: string) => Promise<void> | undefined;
    vehicleId: string;
  
}

const ContactEditor = ({ initialContactCel, handleContactCel , vehicleId}: ContactEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contactCel, setContactCel] = useState(initialContactCel);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: { target: { value: any; }; }) => {
    setContactCel(event.target.value);
  };

  const handleSaveClick = () => {
    console.log("handleSaveClick", contactCel);
    
    handleContactCel(vehicleId, contactCel);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <span className="font-semibold">Cel de contacto:</span>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={contactCel}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Guardar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{contactCel}</span>
          <Pencil
            size={16}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={handleEditClick}
          />
        </div>
      )}
    </div>
  );
};

export default ContactEditor;
