      // Dữ liệu
      let phieuNhap = JSON.parse(localStorage.getItem("phieuNhap")) || [];
      let tyLeLoiNhuan = JSON.parse(localStorage.getItem("tyLeLoiNhuan")) || {
        iPhone: 30,
        Samsung: 25,
        Xiaomi: 20,
        Oppo: 22,
        Khác: 18,
      };
      let chiTietSP = []; // trong phiếu nhập

      // === XỬ LÝ ẢNH ===
      function xemTruocAnh(input) {
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const row = input.closest(".form-row");
            let preview = row.querySelector(".anh-preview");
            if (!preview) {
              preview = document.createElement("img");
              preview.className = "anh-preview";
              input.parentNode.insertBefore(preview, input.nextSibling);
            }
            preview.src = e.target.result;
            preview.style.display = "block";
            // Lưu base64 vào input ẩn
            let hidden = row.querySelector('input[type="hidden"].anh-data');
            if (!hidden) {
              hidden = document.createElement("input");
              hidden.type = "hidden";
              hidden.className = "anh-data";
              row.appendChild(hidden);
            }
            hidden.value = e.target.result;
          };
          reader.readAsDataURL(input.files[0]);
        }
      }

      // === TAB ===
      function moTab(id) {
        document
          .querySelectorAll(".tab")
          .forEach((t) => t.classList.remove("active"));
        document
          .querySelectorAll(".content")
          .forEach((c) => c.classList.remove("active"));
        document
          .querySelector(`.tab[onclick="moTab('${id}')"]`)
          .classList.add("active");
        document.getElementById(id).classList.add("active");
        if (id === "nhap") hienThiPhieu();
        if (id === "gia") hienThiTyLe();
        if (id === "banggia") hienThiBangGia();
      }

      // === PHIẾU NHẬP ===
      function moFormThemPhieu(phieu = null) {
        const modal = document.getElementById("modalPhieu");
        chiTietSP = phieu ? [...phieu.chiTiet] : [];
        document.getElementById("tieuDeModal").textContent = phieu
          ? "Sửa Phiếu Nhập"
          : "Thêm Phiếu Nhập";
        document.getElementById("ngayNhap").value = phieu
          ? phieu.ngay
          : new Date().toISOString().split("T")[0];
        document.getElementById("maPhieu").value = phieu ? phieu.ma : "";
        capNhatChiTietForm();
        modal.style.display = "flex";
      }

      function themDongSP(sp = null) {
        const div = document.createElement("div");
        div.className = "form-row";
        div.style.alignItems = "end";
        div.innerHTML = `
      <input type="file" accept="image/*" onchange="xemTruocAnh(this)" style="width:100px;" />
      <img class="anh-preview" style="display:${
        sp?.anh ? "block" : "none"
      };" src="${sp?.anh || ""}" />
      <input type="hidden" class="anh-data" value="${sp?.anh || ""}" />
      <input type="text" placeholder="Tên sản phẩm" class="tenSP" value="${
        sp?.ten || ""
      }" />
      <select class="loaiSP">
        ${["iPhone", "Samsung", "Xiaomi", "Oppo", "Khác"]
          .map(
            (l) =>
              `<option value="${l}" ${
                sp?.loai === l ? "selected" : ""
              }>${l}</option>`
          )
          .join("")}
      </select>
      <input type="number" placeholder="Số lượng" class="soLuong" min="1" value="${
        sp?.sl || ""
      }" />
      <input type="number" placeholder="Giá nhập" class="giaNhap" min="0" value="${
        sp?.gia || ""
      }" />
      <button type="button" onclick="this.parentElement.remove()" class="btn-danger">Xóa</button>
    `;
        document.getElementById("chiTietSP").appendChild(div);
      }

      function capNhatChiTietForm() {
        const container = document.getElementById("chiTietSP");
        container.innerHTML = "";
        chiTietSP.forEach((sp) => {
          themDongSP(sp);
        });
        if (chiTietSP.length === 0) themDongSP();
      }

      function luuPhieu() {
        const rows = document.querySelectorAll("#chiTietSP .form-row");
        const chiTiet = [];
        let valid = true;

        rows.forEach((r) => {
          const ten = r.querySelector(".tenSP").value.trim();
          const loai = r.querySelector(".loaiSP").value;
          const sl = parseInt(r.querySelector(".soLuong").value) || 0;
          const gia = parseFloat(r.querySelector(".giaNhap").value) || 0;
          const anh = r.querySelector(".anh-data")?.value || "";

          if (ten && sl > 0 && gia >= 0) {
            chiTiet.push({ ten, loai, sl, gia, anh });
          } else if (ten || sl || gia) {
            valid = false;
          }
        });

        if (!valid || chiTiet.length === 0) {
          return alert("Vui lòng nhập đầy đủ thông tin sản phẩm hợp lệ!");
        }

        const ma =
          document.getElementById("maPhieu").value.trim() || "PN" + Date.now();
        const ngay = document.getElementById("ngayNhap").value;
        const index = phieuNhap.findIndex((p) => p.ma === ma);
        const phieu = { ma, ngay, chiTiet, hoanThanh: false };

        if (index >= 0) {
          phieuNhap[index] = phieu;
        } else {
          phieuNhap.push(phieu);
        }

        luuPhieuDB();
        hienThiPhieu();
        dongModal();
      }

      function hoanThanhPhieu(ma) {
        const p = phieuNhap.find((x) => x.ma === ma);
        if (
          p &&
          confirm(
            "Hoàn thành phiếu nhập này? Giá sẽ được cập nhật vào hệ thống."
          )
        ) {
          p.hoanThanh = true;
          p.chiTiet.forEach((sp) => {
            const key = `${sp.loai}|${sp.ten}`;
            if (!tyLeLoiNhuan[key] || tyLeLoiNhuan[key].giaNhap !== sp.gia) {
              tyLeLoiNhuan[key] = {
                loai: sp.loai,
                ten: sp.ten,
                giaNhap: sp.gia,
                tyLe: tyLeLoiNhuan[sp.loai] || 20,
                anh: sp.anh,
              };
            }
          });
          luuTyLeDB();
          luuPhieuDB();
          hienThiPhieu();
          hienThiTyLe();
          hienThiBangGia();
        }
      }

      function xoaPhieu(ma) {
        if (confirm("Xóa phiếu này?")) {
          phieuNhap = phieuNhap.filter((p) => p.ma !== ma);
          luuPhieuDB();
          hienThiPhieu();
        }
      }

      function hienThiPhieu() {
        const tbody = document.querySelector("#bangPhieu tbody");
        tbody.innerHTML = "";
        const ds = [...phieuNhap].sort((a, b) => b.ngay.localeCompare(a.ngay));
        ds.forEach((p) => {
          const tongSL = p.chiTiet.reduce((s, x) => s + x.sl, 0);
          const tongTien = p.chiTiet.reduce((s, x) => s + x.sl * x.gia, 0);
          const spDau = p.chiTiet[0];
          const row = document.createElement("tr");
          row.innerHTML = `
        <td><strong>${p.ma}</strong></td>
        <td>${
          spDau?.anh ? `<img src="${spDau.anh}" class="product-img" />` : ""
        }</td>
        <td>${formatDate(p.ngay)}</td>
        <td>${tongSL}</td>
        <td>${formatTien(tongTien)}</td>
        <td><span class="${p.hoanThanh ? "status-complete" : "status-draft"}">
          ${p.hoanThanh ? "Hoàn thành" : "Nháp"}
        </span></td>
        <td>
          <button class="btn-warning" onclick="moFormThemPhieu(phieuNhap.find(x=>x.ma=== '${
            p.ma
          }'))">Sửa</button>
          ${
            !p.hoanThanh
              ? `<button class="btn-success" onclick="hoanThanhPhieu('${p.ma}')">Hoàn thành</button>`
              : ""
          }
          <button class="btn-danger" onclick="xoaPhieu('${p.ma}')">Xóa</button>
        </td>
      `;
          tbody.appendChild(row);
        });
      }

      function timPhieu() {
        const kw = document.getElementById("timPhieu").value.toLowerCase();
        document.querySelectorAll("#bangPhieu tbody tr").forEach((r) => {
          r.style.display = r.textContent.toLowerCase().includes(kw)
            ? ""
            : "none";
        });
      }

      // === QUẢN LÝ GIÁ ===
      function capNhatTyLeChung() {
        const loai = document.getElementById("loaiSP").value;
        const tyLe = parseFloat(document.getElementById("tyLeChung").value);
        if (!loai || isNaN(tyLe)) return alert("Chọn loại và nhập % hợp lệ!");
        tyLeLoiNhuan[loai] = tyLe;
        luuTyLeDB();
        hienThiTyLe();
      }

      function capNhatTyLeRieng(ten, loai, tyLe) {
        const key = `${loai}|${ten}`;
        if (!tyLeLoiNhuan[key]) {
          tyLeLoiNhuan[key] = {
            loai,
            ten,
            giaNhap: 0,
            tyLe: tyLeLoiNhuan[loai] || 20,
          };
        }
        tyLeLoiNhuan[key].tyLe = tyLe;
        luuTyLeDB();
        hienThiTyLe();
        hienThiBangGia();
      }

      function hienThiTyLe() {
        const tbody = document.querySelector("#bangTyLe tbody");
        tbody.innerHTML = "";
        const ds = [];
        Object.keys(tyLeLoiNhuan).forEach((k) => {
          if (!k.includes("|")) return;
          const [loai, ten] = k.split("|");
          const item = tyLeLoiNhuan[k];
          const giaBan = item.giaNhap * (1 + item.tyLe / 100);
          const anh =
            item.anh ||
            phieuNhap
              .find(
                (p) =>
                  p.hoanThanh &&
                  p.chiTiet.some((ct) => ct.loai === loai && ct.ten === ten)
              )
              ?.chiTiet.find((ct) => ct.loai === loai && ct.ten === ten)?.anh ||
            "";
          ds.push({ loai, ten, anh, ...item, giaBan });
        });

        ds.sort((a, b) => a.ten.localeCompare(b.ten)).forEach((sp) => {
          const row = document.createElement("tr");
          row.innerHTML = `
        <td>${sp.anh ? `<img src="${sp.anh}" class="product-img" />` : ""}</td>
        <td><strong>${sp.ten}</strong></td>
        <td>${sp.loai}</td>
        <td>${formatTien(sp.giaNhap)}</td>
        <td><input type="number" value="${
          sp.tyLe
        }" style="width:70px;" onchange="capNhatTyLeRieng('${sp.ten}', '${
            sp.loai
          }', this.value)" /> %</td>
        <td>${formatTien(sp.giaBan)}</td>
        <td><button class="btn-danger" onclick="xoaTyLeRieng('${sp.loai}','${
            sp.ten
          }')">Xóa</button></td>
      `;
          tbody.appendChild(row);
        });
      }

      function xoaTyLeRieng(loai, ten) {
        if (confirm("Xóa tỷ lệ riêng này?")) {
          delete tyLeLoiNhuan[`${loai}|${ten}`];
          luuTyLeDB();
          hienThiTyLe();
          hienThiBangGia();
        }
      }

      function timSanPhamGia() {
        const kw = document.getElementById("timSanPhamGia").value.toLowerCase();
        document.querySelectorAll("#bangTyLe tbody tr").forEach((r) => {
          r.style.display = r.textContent.toLowerCase().includes(kw)
            ? ""
            : "none";
        });
      }

      // === BẢNG GIÁ CHI TIẾT ===
      function hienThiBangGia() {
        const tbody = document.querySelector("#bangGiaChiTiet tbody");
        tbody.innerHTML = "";
        const ds = [];

        phieuNhap
          .filter((p) => p.hoanThanh)
          .forEach((p) => {
            p.chiTiet.forEach((sp) => {
              const key = `${sp.loai}|${sp.ten}`;
              const tyLe =
                tyLeLoiNhuan[key]?.tyLe || tyLeLoiNhuan[sp.loai] || 20;
              ds.push({
                ten: sp.ten,
                loai: sp.loai,
                anh: sp.anh,
                giaNhap: sp.gia,
                tyLe,
                giaBan: sp.gia * (1 + tyLe / 100),
                nguon: p.ma,
              });
            });
          });

        Object.keys(tyLeLoiNhuan).forEach((k) => {
          if (!k.includes("|")) return;
          const item = tyLeLoiNhuan[k];
          if (item.giaNhap > 0) {
            const anh =
              item.anh ||
              phieuNhap
                .find(
                  (p) =>
                    p.hoanThanh &&
                    p.chiTiet.some(
                      (ct) => ct.loai === item.loai && ct.ten === item.ten
                    )
                )
                ?.chiTiet.find(
                  (ct) => ct.loai === item.loai && ct.ten === item.ten
                )?.anh ||
              "";
            ds.push({
              ten: item.ten,
              loai: item.loai,
              anh,
              giaNhap: item.giaNhap,
              tyLe: item.tyLe,
              giaBan: item.giaNhap * (1 + item.tyLe / 100),
              nguon: "Tỷ lệ riêng",
            });
          }
        });

        const unique = {};
        ds.forEach((d) => {
          const key = `${d.loai}|${d.ten}`;
          if (!unique[key] || d.nguon.includes("PN")) unique[key] = d;
        });

        Object.values(unique)
          .sort((a, b) => a.ten.localeCompare(b.ten))
          .forEach((sp, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${i + 1}</td>
        <td>${sp.anh ? `<img src="${sp.anh}" class="product-img" />` : ""}</td>
        <td><strong>${sp.ten}</strong></td>
        <td>${sp.loai}</td>
        <td>${formatTien(sp.giaNhap)}</td>
        <td>${sp.tyLe}%</td>
        <td><strong>${formatTien(sp.giaBan)}</strong></td>
        <td><small>${sp.nguon}</small></td>
      `;
            tbody.appendChild(row);
          });
      }

      function timBangGia() {
        const kw = document.getElementById("timBangGia").value.toLowerCase();
        document.querySelectorAll("#bangGiaChiTiet tbody tr").forEach((r) => {
          r.style.display = r.textContent.toLowerCase().includes(kw)
            ? ""
            : "none";
        });
      }

      // === HỖ TRỢ ===
      function dongModal() {
        document.getElementById("modalPhieu").style.display = "none";
        chiTietSP = [];
      }

      function formatTien(so) {
        return new Intl.NumberFormat("vi-VN").format(Math.round(so)) + " đ";
      }

      function formatDate(d) {
        return new Date(d).toLocaleDateString("vi-VN");
      }

      function luuPhieuDB() {
        localStorage.setItem("phieuNhap", JSON.stringify(phieuNhap));
      }

      function luuTyLeDB() {
        localStorage.setItem("tyLeLoiNhuan", JSON.stringify(tyLeLoiNhuan));
      }

      // Khởi động
      hienThiPhieu();
      hienThiTyLe();
      hienThiBangGia();
