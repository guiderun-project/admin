export default {
	async confirm_buttonCopyonClick () {
		const API_BASE_URL = "https://dev.guiderun.org";
		const APPSMITH_WEBHOOK_SECRET = "Y64bGKRpjOqD0UN2/MXFhxYvZkt6mh0M2bQgu7Vy+CU=";

		const targetUser = user_tabel.selectedRow;
		const decision = "APPROVE";
		const recordDegree = targetUser?.recordDegree;

		if (!targetUser?.userId) {
			showAlert("처리할 회원을 선택해주세요.", "warning");
			return;
		}

		if (decision === "APPROVE" && !recordDegree) {
			showAlert("기록 등급을 선택해주세요.", "warning");
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
					decision,
					recordDegree,
					requestedBy: appsmith.user.email || "appsmith"
				})
			});

			const data = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(data?.message || data?.msg || "회원 승인 처리에 실패했습니다.");
			}

			showAlert(
				data?.changed === false ? "이미 처리된 회원입니다." : "회원 승인이 완료되었습니다.",
				data?.changed === false ? "warning" : "success"
			);

			return data;
		} catch (error) {
			showAlert(error?.message || "회원 승인 처리에 실패했습니다.", "error");
			return null;
		}
	}
}
