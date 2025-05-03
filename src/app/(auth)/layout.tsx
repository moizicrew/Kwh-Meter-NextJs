const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100">
      <div className="flex flex-col items-center justify-between px-6 py-8 mx-auto h-screen">
        <div className="w-screen bg-white rounded-lg shadow mt-0 max-w-screen-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
