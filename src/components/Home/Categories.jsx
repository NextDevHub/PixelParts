import RedTitle from "../common/components/RedTitle";
import PropTypes from "prop-types";
import Arrows from "../common/components/Arrows";
import i18n from "../common/components/LangConfig";
import { Link } from "react-router-dom";
import { GoCpu } from "react-icons/go";
import { BsGpuCard } from "react-icons/bs";
import { FaMemory } from "react-icons/fa";
import { MdOutlineSdStorage } from "react-icons/md";
import { BsFillMotherboardFill } from "react-icons/bs";
import { ImPower } from "react-icons/im";
import { GiCooler } from "react-icons/gi";
import { MdDevicesOther } from "react-icons/md";
import { CiDesktop } from "react-icons/ci";

const categories = [
  { icon: <GoCpu size={60} />, name: i18n.t("categories.cpu") },
  { icon: <BsGpuCard size={60} />, name: i18n.t("categories.gpu") },
  { icon: <FaMemory size={60} />, name: i18n.t("categories.ram") },
  { icon: <MdOutlineSdStorage size={60} />, name: i18n.t("categories.storage") },
  { icon: <BsFillMotherboardFill size={60} />, name: i18n.t("categories.motherboard") },
  { icon: <ImPower size={60} />, name: i18n.t("categories.psu") },
  { icon: <CiDesktop size={60} />, name: i18n.t("categories.case") },  // For case, a cooler can work, but you can adjust based on your needs.
  { icon: <GiCooler size={60} />, name: i18n.t("categories.cooling") },
  { icon: <MdDevicesOther size={60} />, name: i18n.t("categories.others") },
];

const Category = ({ icon, name }) => (
  <Link to="category">
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="w-72 hover:animate-pulse flex gap-6 items-center justify-center flex-col bg-white py-8 rounded-lg border border-gray-300 transition duration-300 hover:bg-cyan-400 hover:invert hover:shadow-xl hover:-translate-y-2"
    >
      <div className="text-4xl">{icon}</div>
      <div className="text-xl font-semibold">{name}</div>
    </button>
  </Link>
);

const CategoryList = () => (
  <div className="overflow-x-auto flex space-x-4 py-8">
    {categories.map((category, index) => (
      <div className="flex-shrink-0" key={index}>
        <Category icon={category.icon} name={category.name} />
      </div>
    ))}
  </div>
);

export default CategoryList;
