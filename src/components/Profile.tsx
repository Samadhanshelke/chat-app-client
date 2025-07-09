import { Camera, Check, Pencil, Smile } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import Avatar from "./Avatar";
import { useRef, useState } from "react";
import { AuthService } from "../services/AuthService";
import { toast } from "./Toast";
const Profile = () => {
  const { authUser, setAuthUser } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateName, setUpdateName] = useState(false);
  const [name, setName] = useState("");
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const id = toast.loading("Uploading...");
      const response = await AuthService.UpdateProfile(formData);
      console.log(response);
      // Update context with new profile picture
      if (response.data.user.profilePicture) {
        // setAuthUser({ ...authUser!, profilePicture: response.data.imageUrl });
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.profilePicture = response.data.user.profilePicture;
        localStorage.setItem("user", JSON.stringify(userData));
        setAuthUser(userData);
        toast.update(id, "success", "picture uploaded");
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = async () => {
    const formData = new FormData();
    if (!name) {
      return;
    }
    formData.append("name", name);

    try {
      setLoading(true);
      const response = await AuthService.UpdateProfile(formData);
      console.log(response);
      // Update context with new profile picture
      if (response.data.user.name) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.name = response.data.user.name;
        localStorage.setItem("user", JSON.stringify(userData));
        setAuthUser(userData);
        setUpdateName(false);
        toast.success("Name updated successfully!");
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <h3 className="text-xl tracking-wide font-semibold">Profile</h3>

      <div className="w-full mt-10 mx-auto relative overflow-hidden group flex justify-center">
        {authUser?.profilePicture && (
          <>
            <Avatar
              src={authUser.profilePicture}
              alt="User avatar"
              size={200}
              className={loading ? "opacity-50" : ""}
            />
            <div
              className="w-[200px] absolute rounded-full hidden cursor-pointer group-hover:flex bg-gray-900/60 h-full items-center justify-center flex-col text-white transition"
              onClick={handleAvatarClick}
            >
              <Camera size={30} />
              <span className="text-sm mt-2">Change profile photo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        )}
      </div>
      <div className="w-full mt-20 flex flex-col gap-2">
        <label htmlFor="name" className="text-green-700">Your name</label>
        {updateName ? (
          <div className="relative">
            <input
              value={name}
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="border-b pb-1 border-b-gray-700 w-full focus:outline-none"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 pr-1">
              <Smile size={20} />
              <Check
                size={20}
                className="cursor-pointer"
                onClick={handleNameChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span>{authUser?.name}</span>
            <Pencil
              size={20}
              className="cursor-pointer"
              onClick={() => {
                setName(authUser?.name || "");
                setUpdateName(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
