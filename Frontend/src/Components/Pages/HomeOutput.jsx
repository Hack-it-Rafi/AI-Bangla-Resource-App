const HomeOutput = ({output}) => {
    console.log(output);
  return (
    <div className=" bg-[#A64D79] border">
      <div className="bg-black flex justify-center h-[700px] px-4 py-16">{output}</div>
    </div>
  );
};

export default HomeOutput;
