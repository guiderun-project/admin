export default {
	async confirm_buttonCopyonClick () {
		const API_BASE_URL = "https://www.guiderun.org";
		const APPSMITH_WEBHOOK_SECRET = "Y64bGKRpjOqD0UN2/MXFhxYvZkt6mh0M2bQgu7Vy+CU=";

		const targetUser = user_tabel.selectedRow;
		const recordDegree = targetUser?.recordDegree;

		const role = targetUser?.role;

		if (!targetUser?.userId) {
			showAlert("처리할 회원을 선택해주세요.", "warning");
			return;
		}

		if (!recordDegree) {
			showAlert("러닝 그룹을 선택해주세요.", "warning");
			return;
		}

		if (!role) {
			showAlert("권한/승인 값을 선택해주세요.", "warning");
			return;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/webhook/appsmith/user-approval`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Appsmith-Webhook-Secret": APPSMITH_WEBHOOK_SECRET
				},
				body: JSON.stringify({
					userId: targetUser.userId,
					role,
					recordDegree,
					requestedBy: appsmith.user.email || "appsmith"
				})
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data?.message || data?.msg || "회원 정보 저장에 실패했습니다.");
			}

			showAlert(
				data?.changed === false ? "변경된 내용이 없습니다." : "회원 정보가 저장되었습니다.",
				data?.changed === false ? "warning" : "success"
			);

			return data;
		} catch (error) {
			showAlert(error?.message || "회원 정보 저장에 실패했습니다.", "error");
			return null;
		}
	}
}
