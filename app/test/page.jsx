'use client';
import { deleteCookie, getCookie, setCookie } from "cookies-next";

export default function Test() {
  const info = {
    "allStudents": [
      {"id": "1", "name": "学生1", "sn": "RG2WP0BC23D1500001"},
      {"id": "2", "name": "学生2", "sn": "RG2WP0BC23D1500002"},
      {"id": "3", "name": "学生3", "sn": "RG2WP0BC23D1500003"},
      {"id": "4", "name": "学生4", "sn": "RG2WP0BC23D1500004"},
      {"id": "5", "name": "学生5", "sn": "RG2WP0BC23D1500005"},
      {"id": "6", "name": "学生6", "sn": "RG2WP0BC23D1500006"},
      {"id": "7", "name": "学生7", "sn": "RG2WP0BC23D1500007"},
      {"id": "8", "name": "学生8", "sn": "RG2WP0BC23D1500008"},
      {"id": "9", "name": "学生9", "sn": "RG2WP0BC23D1500009"},
      {"id": "10", "name": "学生10", "sn": "RG2WP0BC23D1500010"},
      {"id": "11", "name": "学生11", "sn": "RG2WP0BC23D1500011"},
      {"id": "12", "name": "学生12", "sn": "RG2WP0BC23D1500012"},
      {"id": "13", "name": "学生13", "sn": "RG2WP0BC23D1500013"},
      {"id": "14", "name": "学生14", "sn": "RG2WP0BC23D1500014"},
      {"id": "15", "name": "弈道大佬2", "sn": "RG2WP0BC23D1500015"},
      {"id": "16", "name": "学生16", "sn": "RG2WP0BC23D1500016"},
      {"id": "17", "name": "学生17", "sn": "RG2WP0BC23D1500017"},
      {"id": "18", "name": "学生18", "sn": "RG2WP0BC23D1500018"},
      {"id": "19", "name": "学生19", "sn": "RG2WP0BC23D1500019"},
      {"id": "20", "name": "学生20", "sn": "RG2WP0BC23D1500020"},
      {"id": "21", "name": "学生21", "sn": "RG2WP0BC23D1500021"},
      {"id": "22", "name": "学生22", "sn": "RG2WP0BC23D1500022"},
      {"id": "23", "name": "学生23", "sn": "RG2WP0BC23D1500023"},
      {"id": "24", "name": "学生24", "sn": "RG2WP0BC23D1500024"},
      {"id": "25", "name": "学生25", "sn": "RG2WP0BC23D1500025"},
      {"id": "26", "name": "学生26", "sn": "RG2WP0BC23D1500026"},
      {"id": "27", "name": "学生27", "sn": "RG2WP0BC23D1500027"},
      {"id": "28", "name": "学生28", "sn": "RG2WP0BC23D1500028"},
      {"id": "29", "name": "学生29", "sn": "RG2WP0BC23D1500029"},
      {"id": "30", "name": "学生30", "sn": "RG2WP0BC23D1500030"},
      {"id": "31", "name": "学生31", "sn": "RG2WP0BC23D1500031"},
      {"id": "32", "name": "学生32", "sn": "RG2WP0BC23D1500032"},
      {"id": "33", "name": "学生33", "sn": "RG2WP0BC23D1500033"},
      {"id": "34", "name": "学生34", "sn": "RG2WP0BC23D1500034"},
      {"id": "35", "name": "学生35", "sn": "RG2WP0BC23D1500035"},
      {"id": "36", "name": "学生36", "sn": "RG2WP0BC23D1500036"},
    ],
    "selectStudents": [
      {"id": "15", "name": "弈道大佬2", "sn": "RG2WP0BC23D1500015"}
    ],
    "gridSize": 1,
    "setChessType": 1,
    "redoCount": 1
  }
  const handleSetCookie = () => {
    try {
      setCookie('11111', JSON.stringify(info));
      alert('setCookie成功');
    } catch (error) {
      alert('setCookie失败: ' + error);
    }
  }
  const handleDeleteCookie = () => {
    try {
      deleteCookie('11111');
      alert('deleteCookie成功');
    } catch (error) {
      alert('deleteCookie失败: ' + error);
    }
  }
  return (
    <div>
      <div onClick={handleSetCookie}>setCookie</div>
      <div onClick={handleDeleteCookie}>deleteCookie</div>
    </div>
  );
}